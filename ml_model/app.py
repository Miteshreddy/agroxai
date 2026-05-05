import os
import joblib
import pandas as pd
import shap
from flask import Flask, request, jsonify
from flask_cors import CORS
from soil_mapper import map_farmer_inputs

app = Flask(__name__)
CORS(app)

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths to model and encoders (using absolute paths)
MODEL_PATH = os.path.join(BASE_DIR, 'crop_model.pkl')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'label_encoder.pkl')
SEASON_ENCODER_PATH = os.path.join(BASE_DIR, 'season_encoder.pkl')

# Load model and encoders (if they exist)
model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None
label_encoder = joblib.load(LABEL_ENCODER_PATH) if os.path.exists(LABEL_ENCODER_PATH) else None
season_encoder = joblib.load(SEASON_ENCODER_PATH) if os.path.exists(SEASON_ENCODER_PATH) else None

print(f"Model loaded: {model is not None}")
print(f"Label encoder loaded: {label_encoder is not None}")
print(f"Season encoder loaded: {season_encoder is not None}")

# SHAP explainer – created once the model is loaded
explainer = shap.TreeExplainer(model) if model else None

# Determine the feature order expected by the model
if model and hasattr(model, 'feature_names_in_'):
    EXPECTED_FEATURES = list(model.feature_names_in_)
else:
    # Default order used during training (without season)
    EXPECTED_FEATURES = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})

@app.route('/predict', methods=['POST'])
def predict():
    if not model or not label_encoder:
        return jsonify({"error": "Model or label encoder not loaded"}), 500
    try:
        raw_data = request.get_json(force=True)
        
        # Check if we have descriptive inputs that need mapping
        is_descriptive = 'soil_type' in raw_data or 'rainfall_level' in raw_data
        
        if is_descriptive:
            # Map farmer-friendly inputs to the numeric space
            data = map_farmer_inputs(raw_data)
        else:
            data = raw_data

        # Validate required fields for the ML model
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        if 'season' in EXPECTED_FEATURES:
            required_fields.append('season')
            
        missing_fields = [f for f in required_fields if f not in data or data[f] is None]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        # Build input dict respecting the expected feature order
        numerical_features = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        input_dict = {}
        for feat in EXPECTED_FEATURES:
            if feat in numerical_features:
                input_dict[feat] = float(data.get(feat, 0))
            elif feat == 'season':
                continue # handled below
            else:
                input_dict[feat] = data.get(feat)
        
        # Handle optional season feature
        if 'season' in EXPECTED_FEATURES:
            season_val = data.get('season', '')
            if season_encoder and season_val:
                if season_val in list(season_encoder.classes_):
                    input_dict['season'] = season_encoder.transform([season_val])[0]
                else:
                    input_dict['season'] = 0
            else:
                input_dict['season'] = 0
        
        # Create DataFrame with correct column order
        df = pd.DataFrame([input_dict], columns=EXPECTED_FEATURES)
        
        # Prediction
        pred_class = model.predict(df)[0]
        
        # Get probabilities for all classes
        try:
            probs = model.predict_proba(df)[0]
            confidence = float(max(probs))
            
            # Get top 3 crop recommendations
            top_3_indices = sorted(range(len(probs)), key=lambda i: probs[i], reverse=True)[:3]
            top_3_crops = []
            for idx in top_3_indices:
                crop = label_encoder.inverse_transform([idx])[0]
                prob = round(float(probs[idx]), 4)
                top_3_crops.append({"crop": str(crop), "confidence": prob})
        except Exception as e:
            confidence = 1.0
            top_3_crops = [{"crop": str(label_encoder.inverse_transform([pred_class])[0]), "confidence": 1.0}]
            
        # Decode label
        crop_name = label_encoder.inverse_transform([pred_class])[0]
        
        # SHAP explanation
        shap_vals = explainer.shap_values(df)
        
        if len(shap_vals.shape) == 3:
            shap_row = shap_vals[0, :, int(pred_class)]
        else:
            shap_row = shap_vals[0]
            
        shap_dict = dict(zip(EXPECTED_FEATURES, shap_row))
        top_features = sorted(shap_dict.items(), key=lambda kv: abs(kv[1]), reverse=True)[:3]
        
        explanation = {feat: round(float(val), 4) for feat, val in top_features}
        
        return jsonify({
            "crop": str(crop_name),
            "confidence": round(float(confidence), 4),
            "recommended_crops": top_3_crops,
            "explanation": explanation,
            "mapped_values": {k: v for k, v in data.items() if k != 'season'}
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
