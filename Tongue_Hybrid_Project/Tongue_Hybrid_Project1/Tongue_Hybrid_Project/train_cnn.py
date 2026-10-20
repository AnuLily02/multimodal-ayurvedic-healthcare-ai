import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping


# ===============================
# Paths
# ===============================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

IMAGE_DIR = os.path.join(DATA_DIR, "tongue_dataset", "ROI_images")
CSV_PATH = os.path.join(DATA_DIR, "tongue_labels.CSV")

MODEL_DIR = os.path.join(BASE_DIR, "models")
os.makedirs(MODEL_DIR, exist_ok=True)


# ===============================
# Load CSV
# ===============================

df = pd.read_csv(CSV_PATH)

# Remove hidden spaces
df.columns = df.columns.str.strip()

print("Columns in CSV:", df.columns)

# Keep only what we need
df = df[["Filename", "Class"]]

# Rename properly
df = df.rename(columns={
    "Filename": "filename",
    "Class": "label"
})

# Add .png extension
df["filename"] = df["filename"].astype(str) + ".png"

# Convert label to string (IMPORTANT for sparse mode)
df["label"] = df["label"].astype(str)

print("Dataset shape:", df.shape)
print(df.head())


# ===============================
# Train / Validation Split
# ===============================

train_df, val_df = train_test_split(
    df,
    test_size=0.2,
    stratify=df["label"],
    random_state=42
)

# ===============================
# Compute Class Weights (Fix Imbalance)
# ===============================

from sklearn.utils.class_weight import compute_class_weight

class_weights = compute_class_weight(
    class_weight="balanced",
    classes=np.unique(train_df["label"]),
    y=train_df["label"]
)

class_weights_dict = dict(enumerate(class_weights))
print("Class Weights:", class_weights_dict)


# ===============================
# Image Generators
# ===============================

IMG_SIZE = 224
BATCH_SIZE = 16

train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=15,
    zoom_range=0.1,
    horizontal_flip=True
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_dataframe(
    train_df,
    directory=IMAGE_DIR,
    x_col="filename",
    y_col="label",
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="sparse"
)

val_generator = val_datagen.flow_from_dataframe(
    val_df,
    directory=IMAGE_DIR,
    x_col="filename",
    y_col="label",
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode="sparse"
)


# ===============================
# Build MobileNetV2 Model
# ===============================

base_model = MobileNetV2(
    weights="imagenet",
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

# Fine-tuning: unfreeze last layers
base_model.trainable = False
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.3)(x)
x = Dense(128, activation="relu")(x)
output = Dense(3, activation="softmax")(x)

model = Model(inputs=base_model.input, outputs=output)

model.compile(
    optimizer=Adam(learning_rate=1e-4),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()


# ===============================
# Callbacks
# ===============================

checkpoint = ModelCheckpoint(
    "models/mobilenet_tongue.h5",
    monitor='val_accuracy',
    save_best_only=True
)

early_stop = EarlyStopping(
    monitor="val_accuracy",
    patience=5,
    restore_best_weights=True
)


# ===============================
# Train
# ===============================
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=25,
    callbacks=[checkpoint, early_stop],
    class_weight=class_weights_dict
)


# ===============================
# Fine-tune only last 20 layers
# ===============================

base_model.trainable = True

for layer in base_model.layers[:-20]:
    layer.trainable = False

model.compile(
    optimizer=Adam(learning_rate=1e-5),  # smaller LR
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

history_finetune = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=25,
    class_weight=class_weights,  # <--- THIS MUST BE THERE
    callbacks=[checkpoint, early_stop]
)
# ===============================
# Evaluation
# ===============================

val_generator.reset()
preds = model.predict(val_generator)
y_pred = np.argmax(preds, axis=1)
y_true = val_generator.classes

print("\nClassification Report:\n")
print(classification_report(y_true, y_pred))

cm = confusion_matrix(y_true, y_pred)

plt.figure(figsize=(6,5))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.savefig(os.path.join(BASE_DIR, "confusion_matrix.png"))
plt.show()
model.save(os.path.join(MODEL_DIR, "tongue_model_final.h5"))
print("\nTraining complete. Model saved in models/ folder.")