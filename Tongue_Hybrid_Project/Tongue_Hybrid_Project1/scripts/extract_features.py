import os
import cv2
import numpy as np
import pandas as pd
from skimage.feature import graycomatrix, graycoprops
from tqdm import tqdm

# ==============================
# CONFIGURATION
# ==============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, "raw_dataset", "Cropped_images")
OUTPUT_CSV = "../features/tongue_features.csv"
IMAGE_SIZE = 224

# ==============================
# FEATURE FUNCTIONS
# ==============================

def extract_color_features(image):
    image = cv2.resize(image, (IMAGE_SIZE, IMAGE_SIZE))
    
    mean_r = np.mean(image[:, :, 2])
    mean_g = np.mean(image[:, :, 1])
    mean_b = np.mean(image[:, :, 0])

    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    mean_h = np.mean(hsv[:, :, 0])
    mean_s = np.mean(hsv[:, :, 1])
    mean_v = np.mean(hsv[:, :, 2])

    return mean_r, mean_g, mean_b, mean_h, mean_s, mean_v


def extract_texture_features(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.resize(gray, (IMAGE_SIZE, IMAGE_SIZE))

    glcm = graycomatrix(gray, distances=[1], angles=[0], levels=256, symmetric=True, normed=True)

    contrast = graycoprops(glcm, 'contrast')[0, 0]
    homogeneity = graycoprops(glcm, 'homogeneity')[0, 0]
    energy = graycoprops(glcm, 'energy')[0, 0]
    correlation = graycoprops(glcm, 'correlation')[0, 0]

    return contrast, homogeneity, energy, correlation


def extract_whiteness(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 200, 255, cv2.THRESH_BINARY)
    white_ratio = np.sum(thresh == 255) / (IMAGE_SIZE * IMAGE_SIZE)
    return white_ratio


# ==============================
# MAIN LOOP
# ==============================

all_data = []

for folder in ["00", "01"]:
    folder_path = os.path.join(DATASET_PATH, folder)
    
    for file in tqdm(os.listdir(folder_path)):
        if file.lower().endswith((".jpg", ".jpeg", ".png", ".heic")):
            
            img_path = os.path.join(folder_path, file)
            image = cv2.imread(img_path)
            
            if image is None:
                continue
            
            image = cv2.resize(image, (IMAGE_SIZE, IMAGE_SIZE))

            r, g, b, h, s, v = extract_color_features(image)
            contrast, homogeneity, energy, correlation = extract_texture_features(image)
            white_ratio = extract_whiteness(image)

            all_data.append([
                file,
                folder,  # camera type
                r, g, b,
                h, s, v,
                contrast, homogeneity, energy, correlation,
                white_ratio
            ])

columns = [
    "filename",
    "camera_type",
    "mean_r", "mean_g", "mean_b",
    "mean_h", "mean_s", "mean_v",
    "contrast", "homogeneity", "energy", "correlation",
    "white_ratio"
]

df = pd.DataFrame(all_data, columns=columns)
os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
df.to_csv(OUTPUT_CSV, index=False)

print("Feature extraction completed!")