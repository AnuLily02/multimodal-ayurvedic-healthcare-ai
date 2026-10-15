import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))
import random
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

from logic.logic_engine import analyze

# -----------------------
# SETTINGS
# -----------------------
RANDOM_SEED = 42
random.seed(RANDOM_SEED)

MODEL_SAVE_PATH = "models/logic_ml.pkl"

LABEL_MAP = {
    "Vata": 0,
    "Pitta": 1,
    "Kapha": 2
}

# Core phrase groups based on your logic engine knowledge
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


def extract_logic_features(result):
    scores = result.get("dosha_scores", {})
    return [
        float(scores.get("Vata", 0.0)),
        float(scores.get("Pitta", 0.0)),
        float(scores.get("Kapha", 0.0)),
    ]


def build_dataset(samples_per_class=250):
    X = []
    y = []

    class_specs = [
        ("Vata", VATA_PHRASES),
        ("Pitta", PITTA_PHRASES),
        ("Kapha", KAPHA_PHRASES),
    ]

    for class_name, phrase_pool in class_specs:
        target_label = LABEL_MAP[class_name]
        kept = 0
        attempts = 0

        while kept < samples_per_class and attempts < samples_per_class * 20:
            attempts += 1
            text = make_case(phrase_pool)
            result = analyze(text)

            dominant = result.get("dominant_dosha", "Undetermined")

            if dominant != class_name:
                continue
            if "-" in dominant or dominant == "Undetermined":
                continue

            features = extract_logic_features(result)
            X.append(features)
            y.append(target_label)
            kept += 1

        print(f"{class_name}: kept {kept} samples after {attempts} attempts")

    return np.array(X), np.array(y)


def main():
    print("Generating synthetic training data from logic_engine.py ...")
    X, y = build_dataset(samples_per_class=250)

    print(f"Total samples: {len(X)}")
    if len(X) == 0:
        raise ValueError("No samples generated. Check logic_engine.py import or phrase pools.")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=RANDOM_SEED,
        stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=300,
        random_state=RANDOM_SEED,
        class_weight="balanced"
    )

    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    print("\nLogic ML Model Report:\n")
    print(classification_report(y_test, preds))

    os.makedirs("models", exist_ok=True)
    joblib.dump(model, MODEL_SAVE_PATH)
    print(f"\nSaved: {MODEL_SAVE_PATH}")


if __name__ == "__main__":
    main()