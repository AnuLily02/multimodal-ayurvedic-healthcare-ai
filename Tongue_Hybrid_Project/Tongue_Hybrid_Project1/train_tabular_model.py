import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from xgboost import XGBClassifier
import joblib

# ==============================
# LOAD DATA
# ==============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "tongue_Labels.csv")

df = pd.read_csv(CSV_PATH)

print("Dataset Loaded:", df.shape)
print("\nClass Distribution:\n")
print(df["Class"].value_counts())

# Drop non-numeric column
df = df.drop(columns=["Filename"])

X = df.drop("Class", axis=1)
y = df["Class"]

# ==============================
# TRAIN TEST SPLIT
# ==============================

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ==============================
# XGBOOST MODEL
# ==============================

model = XGBClassifier(
    n_estimators=500,
    max_depth=7,
    learning_rate=0.05,
    objective="multi:softmax",
    num_class=3,
    eval_metric="mlogloss",
    scale_pos_weight=3,
    random_state=42
)
model.fit(X_train, y_train)

# ==============================
# EVALUATION
# ==============================

y_pred = model.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))

print("\nClassification Report:\n")
print(classification_report(
    y_test,
    y_pred,
    target_names=["Pitta", "Vata", "Kapha"]
))

print("\nConfusion Matrix:\n")
print(confusion_matrix(y_test, y_pred))

# ==============================
# SAVE MODEL
# ==============================

models_path = os.path.join(BASE_DIR, "models")
os.makedirs(models_path, exist_ok=True)

joblib.dump(model, os.path.join(models_path, "tongue_tabular_xgb.pkl"))

print("\nModel saved successfully!")