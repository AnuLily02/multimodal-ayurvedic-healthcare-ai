import sys
import os
import random
import joblib
import numpy as np
import pandas as pd
from PIL import Image
from tensorflow.keras.models import load_model
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Add project root to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

from logic.logic_engine import analyze

# -----------------------
# SETTINGS
# -----------------------
RANDOM_SEED = 42
random.seed(RANDOM_SEED)
np.random.seed(RANDOM_SEED)

CNN_MODEL_PATH = r"C:\Tongue_Hybrid_Project1\Tongue_Hybrid_Project\models\mobilenet_tongue.h5"
IMAGE_LABELS_PATH = r"C:\Tongue_Hybrid_Project1\Tongue_Hybrid_Project\data\tongue_labels.csv"
IMAGE_FOLDER = r"C:\Tongue_Hybrid_Project1\Tongue_Hybrid_Project\data\tongue_dataset\Crop_images"

IMAGE_ML_PATH = "models/image_ml.pkl"
LOGIC_ML_PATH = "models/logic_ml.pkl"
FINAL_MODEL_SAVE_PATH = "models/final_model.pkl"

LABEL_MAP = {
    "Vata": 0,
    "Pitta": 1,
    "Kapha": 2
}

REVERSE_LABEL_MAP = {
    0: "Vata",
    1: "Pitta",
    2: "Kapha"
}

# -----------------------
# LOGIC CASES
# -----------------------
VATA_PHRASES = [
    "dry skin", "dry mouth", "cracked lips", "constipation", "gas",
    "bloating", "anxiety", "fear", "insomnia", "tremors",
    "twitching", "stiffness", "joint pain", "stabbing pain",
    "throbbing", "variable appetite", "weight loss", "fatigue",
    "palpitations"
]

PITTA_PHRASES = [
    "burning", "burning sensation", "hot", "fever", "acidity",
    "acid reflux", "ulcer", "anger", "irritability", "inflammation",
    "redness", "rashes", "loose stools", "diarrhea", "excessive hunger",
    "thirst", "sour belching", "foul smell"
]

KAPHA_PHRASES = [
    "mucus", "phlegm", "blocked nose", "blocked", "cold", "cough",
    "wheezing", "heaviness", "swelling", "lethargy", "drowsiness",
    "sleepiness", "slow digestion", "indigestion", "nausea",
    "water retention", "weight gain", "lazy", "sticky stools",
    "white coating"
]

SEVERITY_WORDS = ["mild", "moderate", "severe", "chronic", "persistent"]
TIME_OPTIONS = ["morning", "afternoon", "evening", "night"]
AGE_OPTIONS = ["child", "adult", "middle", "old"]
SEASON_OPTIONS = ["summer", "rainy", "winter", "spring", "autumn"]


def make_case(phrases, include_context=True, include_severity=True):
    n = random.choice([2, 3, 4])
    chosen = random.sample(phrases, min(n, len(phrases)))

    text = "I have " + ", ".join(chosen)

    if include_severity and random.random() < 0.7:
        sev = random.choice(SEVERITY_WORDS)
        text += f". It feels {sev}"

    if include_context and random.random() < 0.7:
        tod = random.choice(TIME_OPTIONS)
        age = random.choice(AGE_OPTIONS)
        season = random.choice(SEASON_OPTIONS)
        text += f" during {tod}. I am {age}. It is {season}"

    return text


def generate_logic_text_for_class(class_id):
    if class_id == 0:
        return make_case(VATA_PHRASES)
    elif class_id == 1:
        return make_case(PITTA_PHRASES)
    else:
        return make_case(KAPHA_PHRASES)


def get_logic_probs(logic_ml_model, class_id, max_attempts=20):
    target_name = REVERSE_LABEL_MAP[class_id]

    for _ in range(max_attempts):
        text = generate_logic_text_for_class(class_id)
        result = analyze(text)
        dominant = result.get("dominant_dosha", "Undetermined")

        if dominant != target_name or "-" in dominant or dominant == "Undetermined":
            continue

        scores = result.get("dosha_scores", {})
        logic_features = [[
            float(scores.get("Vata", 0.0)),
            float(scores.get("Pitta", 0.0)),
            float(scores.get("Kapha", 0.0)),
        ]]

        logic_probs = logic_ml_model.predict_proba(logic_features)[0]
        return logic_probs

    return None


def load_image_dataframe():
    # If your label file is xlsx, change this to pd.read_excel(IMAGE_LABELS_PATH)
    return pd.read_csv(IMAGE_LABELS_PATH)


def build_image_path(filename_value):
    """
    Try multiple possible filename patterns.
    Your dataset likely has names like:
    001_02_00-crop.jpg
    """
    base = str(filename_value).strip()

    candidates = [
        os.path.join(IMAGE_FOLDER, base + "-crop.jpg"),
        os.path.join(IMAGE_FOLDER, base + ".jpg"),
        os.path.join(IMAGE_FOLDER, base + "-crop.png"),
        os.path.join(IMAGE_FOLDER, base + ".png"),
    ]

    for path in candidates:
        if os.path.exists(path):
            return path

    return None


def get_image_probs(cnn_model, image_ml_model, img_path):
    img = Image.open(img_path).convert("RGB")
    img = img.resize((224, 224))
    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)

    cnn_output = cnn_model.predict(arr, verbose=0)[0]
    image_probs = image_ml_model.predict_proba([cnn_output])[0]
    return image_probs


def main():
    print("Loading models...")
    cnn_model = load_model(CNN_MODEL_PATH)
    image_ml_model = joblib.load(IMAGE_ML_PATH)
    logic_ml_model = joblib.load(LOGIC_ML_PATH)

    print("Loading image labels...")
    df = load_image_dataframe()

    X = []
    y = []
    missing_count = 0
    skipped_logic_count = 0

    for _, row in df.iterrows():
        filename_value = row["Filename"]
        label = int(row["Class"])

        img_path = build_image_path(filename_value)

        if img_path is None:
            missing_count += 1
            continue

        try:
            image_probs = get_image_probs(cnn_model, image_ml_model, img_path)
        except Exception as e:
            print(f"Image error for {img_path}: {e}")
            continue

        logic_probs = get_logic_probs(logic_ml_model, label)

        if logic_probs is None:
            skipped_logic_count += 1
            continue

        final_features = list(image_probs) + list(logic_probs)

        X.append(final_features)
        y.append(label)

    X = np.array(X)
    y = np.array(y)

    print(f"Total final samples: {len(X)}")
    print(f"Missing images skipped: {missing_count}")
    print(f"Logic generation skips: {skipped_logic_count}")

    if len(X) == 0:
        raise ValueError("No training samples created for final model.")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=RANDOM_SEED,
        stratify=y
    )

    final_model = RandomForestClassifier(
        n_estimators=300,
        random_state=RANDOM_SEED,
        class_weight="balanced"
    )

    final_model.fit(X_train, y_train)

    preds = final_model.predict(X_test)

    print("\nFinal ML Model Report:\n")
    print(classification_report(y_test, preds))

    os.makedirs("models", exist_ok=True)
    joblib.dump(final_model, FINAL_MODEL_SAVE_PATH)
    print(f"\nSaved: {FINAL_MODEL_SAVE_PATH}")


if __name__ == "__main__":
    main()