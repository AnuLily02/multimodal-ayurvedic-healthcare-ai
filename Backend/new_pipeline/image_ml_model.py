import joblib

model = joblib.load("models/image_ml.pkl")

def predict_image_ml(cnn_output):
    probs = model.predict_proba([cnn_output])[0]
    return probs.tolist()