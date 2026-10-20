import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# ==============================
# LOAD DATA
# ==============================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "features", "tongue_features.csv")

df = pd.read_csv(CSV_PATH)

print("\nDataset Shape:", df.shape)
print("\nColumns:\n", df.columns)
print("\nBasic Statistics:\n")
print(df.describe())

# ==============================
# SELECT NUMERIC FEATURES
# ==============================

feature_columns = [
    "mean_r", "mean_g", "mean_b",
    "mean_h", "mean_s", "mean_v",
    "contrast", "homogeneity",
    "energy", "correlation",
    "white_ratio"
]

X = df[feature_columns]

# ==============================
# STANDARDIZE FEATURES
# ==============================

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ==============================
# K-MEANS CLUSTERING (3 CLUSTERS)
# ==============================

kmeans = KMeans(n_clusters=3, random_state=42)
df["cluster"] = kmeans.fit_predict(X_scaled)

print("\nCluster Counts:")
print(df["cluster"].value_counts())

# ==============================
# PCA FOR VISUALIZATION
# ==============================

pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

df["pca1"] = X_pca[:, 0]
df["pca2"] = X_pca[:, 1]

# ==============================
# PLOT CLUSTERS
# ==============================

plt.figure(figsize=(8,6))
sns.scatterplot(data=df, x="pca1", y="pca2", hue="cluster", palette="Set1")
plt.title("Tongue Feature Clusters (PCA Projection)")
plt.show()

print("\nCluster Feature Means:\n")
cluster_means = df.groupby("cluster")[feature_columns].mean()
print(cluster_means)

print("\nCluster Feature Means:\n")
cluster_means = df.groupby("cluster")[feature_columns].mean()
print(cluster_means)

# Save clustered dataset
OUTPUT_CLUSTERED = os.path.join(BASE_DIR, "features", "tongue_features_clustered.csv")
df.to_csv(OUTPUT_CLUSTERED, index=False)

print("\nClustered dataset saved successfully!")