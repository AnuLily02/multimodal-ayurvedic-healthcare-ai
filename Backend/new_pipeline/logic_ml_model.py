import joblib

model = joblib.load("models/logic_ml.pkl")

def predict_logic_ml(logic_scores):
    features = [
        logic_scores.get("Vata", 0),
        logic_scores.get("Pitta", 0),
        logic_scores.get("Kapha", 0)
    ]

    probs = model.predict_proba([features])[0]
    return probs.tolist()