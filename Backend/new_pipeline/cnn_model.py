import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import io

model = load_model(r"C:\Tongue_Hybrid_Project1\Tongue_Hybrid_Project\models\mobilenet_tongue.h5")

def predict_cnn(image_bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((224, 224))

    arr = np.array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)

    preds = model.predict(arr)[0]
    return preds.tolist()