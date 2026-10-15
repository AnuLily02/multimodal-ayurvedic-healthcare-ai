import os
import joblib
import numpy as np
import pandas as pd
from PIL import Image
from tensorflow.keras.models import load_model
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# -----------------------
# PATHS (UPDATE IF NEEDED)
# -----------------------

CNN_MODEL_PATH = r"C:\Tongue_Hybrid_Project1\Tongue_Hybrid_Project\models\mobilenet_tongue.h5"
DATA_PATH = r"C:\Tongue_Hybrid_Project1\Tongue_Hybrid_Project\data\tongue_labels.csv"
IMAGE_FOLDER = r"C:\Tongue_Hybrid_Project1\Tongue_Hybrid_Project\data\tongue_dataset\Crop_images"

# -----------------------
# LOAD MODEL + DATA
# -----------------------

cnn_model = load_model(CNN_MODEL_PATH)
df = pd.read_csv(DATA_PATH)

X = []
y = []

# -----------------------
# PROCESS EACH ROW
# -----------------------

for _, row in df.iterrows():

    filename = row["Filename"] + ".jpg"  # ← important fix
    label = row["Class"]

    img_path = os.path.join(IMAGE_FOLDER, filename)

    # Skip if image not found
    if not os.path.exists(img_path):
        print(f"Missing image: {img_path}")
        continue

    # Load image
    img = Image.open(img_path).convert("RGB")
    img = img.resize((224, 224))

    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # CNN prediction
    cnn_output = cnn_model.predict(img_array, verbose=0)[0]

    X.append(cnn_output)
    y.append(label)

X = np.array(X)
y = np.array(y)

# -----------------------
# TRAIN MODEL
# -----------------------

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=300,
    random_state=42,
    class_weight="balanced"
)
model.fit(X_train, y_train)
# -----------------------
# EVALUATION
# -----------------------

preds = model.predict(X_test)

print("\nImage ML Model Report:\n")
print(classification_report(y_test, preds))

# -----------------------
# SAVE MODEL
# -----------------------

joblib.dump(model, "models/image_ml.pkl")
print("\nSaved: models/image_ml.pkl")