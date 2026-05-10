import os
import logging
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import joblib
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from soil_mapper import map_farmer_inputs

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Paths to model, encoders, and profiles (using absolute paths)
MODEL_PATH = os.path.join(BASE_DIR, 'crop_model.pkl')
LABEL_ENCODER_PATH = os.path.join(BASE_DIR, 'label_encoder.pkl')
SEASON_ENCODER_PATH = os.path.join(BASE_DIR, 'season_encoder.pkl')
CROP_PROFILES_PATH = os.path.join(BASE_DIR, 'crop_profiles.pkl')

# Load models, encoders, and agricultural profiles
model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None
label_encoder = joblib.load(LABEL_ENCODER_PATH) if os.path.exists(LABEL_ENCODER_PATH) else None
season_encoder = joblib.load(SEASON_ENCODER_PATH) if os.path.exists(SEASON_ENCODER_PATH) else None
crop_profiles = joblib.load(CROP_PROFILES_PATH) if os.path.exists(CROP_PROFILES_PATH) else None

print(f"Model loaded: {model is not None}")
print(f"Label encoder loaded: {label_encoder is not None}")
print(f"Season encoder loaded: {season_encoder is not None}")
print(f"Crop profiles loaded: {crop_profiles is not None}")

# Determine the feature order expected by the model
if model and hasattr(model, 'feature_names_in_'):
    EXPECTED_FEATURES = list(model.feature_names_in_)
elif model and hasattr(model, 'estimator') and hasattr(model.estimator, 'feature_names_in_'):
    EXPECTED_FEATURES = list(model.estimator.feature_names_in_)
else:
    # Default order used during training (including engineered features)
    EXPECTED_FEATURES = [
        'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall',
        'np_ratio', 'kp_ratio', 'nk_ratio', 'fertility_index', 'nutrient_balance_score',
        'temp_humidity_index', 'temp_rainfall_interaction', 'ph_suitability',
        'environmental_stress_score', 'soil_health_index', 'yield_potential_estimate'
    ]

def engineer_features_single(input_dict):
    """
    Engineers advanced agricultural features for a single sample input.
    Returns a dict containing both original and engineered features.
    """
    out = input_dict.copy()
    
    # Extract raw base values
    n = float(out.get('N', 0))
    p = float(out.get('P', 0))
    k = float(out.get('K', 0))
    temp = float(out.get('temperature', 0))
    humid = float(out.get('humidity', 0))
    ph = float(out.get('ph', 0))
    rain = float(out.get('rainfall', 0))
    
    # --- NUTRIENT FEATURES ---
    out['np_ratio'] = n / (p + 1e-5)
    out['kp_ratio'] = k / (p + 1e-5)
    out['nk_ratio'] = n / (k + 1e-5)
    out['fertility_index'] = (n + p + k) / 3.0
    
    # Scale-invariant nutrient balance score
    total_nutrients = n + p + k + 1e-5
    n_pct = n / total_nutrients
    p_pct = p / total_nutrients
    k_pct = k / total_nutrients
    prop_std = np.std([n_pct, p_pct, k_pct])
    out['nutrient_balance_score'] = 1.0 / (prop_std + 0.1)
    
    # --- ENVIRONMENTAL FEATURES ---
    out['temp_humidity_index'] = 0.8 * temp + (humid / 100.0) * (temp - 14.4) + 46.4
    out['temp_rainfall_interaction'] = temp * rain / 100.0
    out['ph_suitability'] = np.exp(-0.5 * ((ph - 6.5) / 1.0)**2)
    
    # Environmental Stress Index
    temp_stress = np.maximum(0, np.maximum(18.0 - temp, temp - 32.0))
    humid_stress = np.maximum(0, np.maximum(40.0 - humid, humid - 85.0)) / 10.0
    ph_stress = np.maximum(0, np.maximum(5.5 - ph, ph - 7.5)) * 2.0
    rain_stress = np.maximum(0, np.maximum(50.0 - rain, rain - 400.0)) / 100.0
    out['environmental_stress_score'] = temp_stress + humid_stress + ph_stress + rain_stress
    
    # --- COMPOSITE FEATURES ---
    out['soil_health_index'] = out['fertility_index'] * out['ph_suitability']
    out['yield_potential_estimate'] = (out['fertility_index'] * out['ph_suitability']) / (1.0 + out['environmental_stress_score'])
    
    return out

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

        # Validate required base fields
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        missing_fields = [f for f in required_fields if f not in data or data[f] is None]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        # Construct basic numerical input dictionary
        input_dict = {f: float(data[f]) for f in required_fields}
        
        # Perform inference-time feature engineering to match trained features
        engineered_dict = engineer_features_single(input_dict)
        
        # Format DataFrame with exactly the expected feature columns and order
        ordered_input = {}
        for feat in EXPECTED_FEATURES:
            if feat in engineered_dict:
                ordered_input[feat] = float(engineered_dict[feat])
            else:
                ordered_input[feat] = 0.0 # safety fallback for unexpected features
                
        df = pd.DataFrame([ordered_input])[EXPECTED_FEATURES]
        
        # 1. Get Calibrated probabilities for all classes
        probs = model.predict_proba(df)[0]
        
        # 2. Compute Crop Agricultural Compatibility Indices (ACI) (Phase 9)
        hybrid_scores = []
        weights = {'N': 1.0, 'P': 1.0, 'K': 1.0, 'temperature': 2.0, 'humidity': 1.5, 'ph': 2.0, 'rainfall': 2.0}
        total_weight = sum(weights.values())
        
        for idx, prob in enumerate(probs):
            crop_name = label_encoder.inverse_transform([idx])[0]
            
            # Compute physical suitability from dataset profiles
            aci_score = 0.0
            profile = crop_profiles.get(crop_name) if crop_profiles else None
            
            if profile:
                for feat, weight in weights.items():
                    val = float(input_dict[feat])
                    mean = profile[feat]['mean']
                    std = profile[feat]['std']
                    p10 = profile[feat]['p10']
                    p90 = profile[feat]['p90']
                    
                    if p10 <= val <= p90:
                        f_score = 1.0
                    else:
                        dist = min(abs(val - p10), abs(val - p90))
                        f_score = np.exp(-0.5 * (dist / (std + 1e-5))**2)
                    aci_score += weight * f_score
                aci_score = aci_score / total_weight
            else:
                aci_score = 0.5 # flat fallback if profile doesn't exist
            
            # Combine Calibrated ML probability and Agricultural Compatibility Index (HS_c = 0.6 * P_c + 0.4 * ACI_c)
            # This balances ML predictive patterns with actual physical agronomic feasibility
            hybrid_score = 0.6 * float(prob) + 0.4 * aci_score
            hybrid_scores.append({
                "class_idx": idx,
                "crop": str(crop_name),
                "ml_prob": float(prob),
                "aci": float(aci_score),
                "hybrid_score": float(hybrid_score)
            })
            
        # Sort recommendations based on the Hybrid Suitability Score (Phase 5 & 6)
        ranked_recommendations = sorted(hybrid_scores, key=lambda x: x['hybrid_score'], reverse=True)
        
        # Get Top-3 recommendation outputs
        top_3_crops = []
        for rec in ranked_recommendations[:3]:
            top_3_crops.append({
                "crop": rec["crop"],
                "confidence": round(rec["hybrid_score"], 4)
            })
            
        # Main recommended crop (highest hybrid score)
        best_rec = ranked_recommendations[0]
        crop_name = best_rec["crop"]
        confidence = best_rec["hybrid_score"]
        
        # 3. Generate dynamic Agricultural Explanations (Phase 8)
        # Compute dynamic feature contribution scores for explainability using the best crop profile
        try:
            # Load base feature importances as scaling factor
            if hasattr(model, 'estimator') and hasattr(model.estimator, 'feature_importances_'):
                importances = model.estimator.feature_importances_
            elif hasattr(model, 'feature_importances_'):
                importances = model.feature_importances_
            else:
                importances = [0.14] * len(EXPECTED_FEATURES)
                
            feat_importance = dict(zip(EXPECTED_FEATURES, importances))
            explanation = {}
            profile = crop_profiles.get(crop_name) if crop_profiles else None
            
            if profile:
                for feat in ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']:
                    val = float(input_dict[feat])
                    mean = profile[feat]['mean']
                    std = profile[feat]['std']
                    p10 = profile[feat]['p10']
                    p90 = profile[feat]['p90']
                    
                    if p10 <= val <= p90:
                        suit = 1.0
                    else:
                        dist = min(abs(val - p10), abs(val - p90))
                        suit = np.exp(-0.5 * (dist / (std + 1e-5))**2)
                        
                    imp = feat_importance.get(feat, 0.1)
                    
                    # Positive contribution if environmental feature is highly suitable
                    # Negative contribution if feature represents a constraint or stress
                    if suit >= 0.8:
                        explanation[feat] = round(float(imp * suit), 4)
                    else:
                        explanation[feat] = round(float(-imp * (1.0 - suit)), 4)
            else:
                # Balanced standard explanation fallback
                explanation = {"N": 0.15, "P": 0.1, "K": 0.1, "temperature": 0.15, "humidity": 0.2, "ph": 0.1, "rainfall": 0.2}
        except Exception as expl_err:
            print(f"Explanation generator fallback due to error: {expl_err}")
            explanation = {"N": 0.15, "P": 0.1, "K": 0.1, "temperature": 0.15, "humidity": 0.2, "ph": 0.1, "rainfall": 0.2}

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
