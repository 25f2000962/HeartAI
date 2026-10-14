import joblib
import pandas as pd

# Load our saved model package

package = joblib.load("heart_disease_package.pkl")

best_models = package["models"]
selected_features = package["selected_features"]
input_columns = package["input_columns"]

print("Model package loaded successfully!")
print("Number of models:", len(best_models))
print("Models:", list(best_models.keys()))

print("\nFeatures required by each model:")
for target, features in selected_features.items():
    print(f"{target}: {len(features)} features")
