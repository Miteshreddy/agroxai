import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
import os

def train_crop_model():
    # 1. Load the Crop Recommendation Dataset
    data_path = 'crop_data.csv'
    if not os.path.exists(data_path):
        print(f"Error: {data_path} not found.")
        return

    df = pd.read_csv(data_path)
    print("Dataset loaded successfully.")

    # 2. Preprocess the data
    # Encode 'season' column if it exists
    if 'season' in df.columns:
        season_encoder = LabelEncoder()
        df['season'] = season_encoder.fit_transform(df['season'])
        joblib.dump(season_encoder, 'season_encoder.pkl')
        print("Season column encoded and encoder saved.")
    else:
        print("Warning: 'season' column not found in dataset. Skipping season encoding.")
    
    # Encode target 'label' column
    if 'label' in df.columns:
        label_encoder = LabelEncoder()
        df['label'] = label_encoder.fit_transform(df['label'])
        joblib.dump(label_encoder, 'label_encoder.pkl')
        print("Label column encoded and encoder saved.")
    else:
        print("Error: 'label' column not found.")
        return

    # Features and Target
    X = df.drop('label', axis=1)
    y = df['label']

    # 3. Split data into train/test sets (80/20)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # 4. Train an XGBoost classifier
    # If using local Mac with libomp, this should work now.
    model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)
    model.fit(X_train, y_train)
    print("Model training complete.")

    # 5. Evaluate accuracy on the test set
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Test Set Accuracy: {accuracy * 100:.2f}%")

    # 6. Save the trained model
    joblib.dump(model, 'crop_model.pkl')
    print("Model saved as crop_model.pkl")

if __name__ == "__main__":
    train_crop_model()
