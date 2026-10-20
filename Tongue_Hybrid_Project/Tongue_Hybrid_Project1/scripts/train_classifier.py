import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# ==============================
# LOAD DATA
# ==============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "features", "tongue_features_clustered.csv")

df = pd.read_csv(CSV_PATH)

print("Dataset Loaded:", df.shape)

# ==============================
# SELECT FEATURES + LABEL
# ==============================

feature_columns = [
    "mean_r", "mean_g", "mean_b",
    "mean_h", "mean_s", "mean_v",
    "contrast", "homogeneity",
    "energy", "correlation",
    "white_ratio"
]

X = df[feature_columns]
y = df["cluster"]

# ==============================
# TRAIN TEST SPLIT
# ==============================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ==============================
# SCALING
# ==============================

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ==============================
# RANDOM FOREST MODEL
# ==============================

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train_scaled, y_train)

label_map = {
    0: "Pitta",
    1: "Vata",
    2: "Kapha"
}
# ==============================
# EVALUATION
# ==============================

y_pred = model.predict(X_test_scaled)

print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))
print("\nConfusion Matrix:\n")
print(confusion_matrix(y_test, y_pred))

# ==============================
# SAVE MODEL
# ==============================

os.makedirs(os.path.join(BASE_DIR, "models"), exist_ok=True)

joblib.dump(model, os.path.join(BASE_DIR, "models", "tongue_rf_model.pkl"))
joblib.dump(scaler, os.path.join(BASE_DIR, "models", "scaler.pkl"))

print("\nModel and scaler saved successfully!")
