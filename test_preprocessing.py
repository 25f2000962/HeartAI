import pandas as pd
from app import preprocess_clinical_data, input_columns

# Load the original dataset if its Excel file is available locally.
# For now, we'll test the preprocessing function's output structure.

test_record = {
    "Age": 53,
    "Weight": 90,
    "Length": 175,
    "BMI": 29.387755102040817,
    "DM": 0,
    "HTN": 1,
    "Current Smoker": 1,
    "EX-Smoker": 0,
    "FH": 0,
    "Obesity": "Y",
    "CRF": "N",
    "CVA": "N",
    "Airway disease": "N",
    "Thyroid Disease": "N",
    "CHF": "N",
    "DLP": "Y",
    "BP": 110,
    "PR": 80,
    "Edema": 0,
    "Weak Peripheral Pulse": "N",
    "Lung rales": "N",
    "Systolic Murmur": "N",
    "Diastolic Murmur": "N",
    "Typical Chest Pain": 0,
    "Dyspnea": "N",
    "Function Class": 0,
    "Atypical": "N",
    "Nonanginal": "N",
    "LowTH Ang": "N",
    "Q Wave": 0,
    "St Elevation": 0,
    "St Depression": 1,
    "Tinversion": 1,
    "LVH": "N",
    "Poor R Progression": "N",
    "BBB": "N",
    "FBS": 90,
    "CR": 0.7,
    "TG": 250,
    "LDL": 155,
    "HDL": 30.0,
    "BUN": 8,
    "ESR": 7,
    "HB": 15.6,
    "K": 4.7,
    "Na": 141,
    "WBC": 5700,
    "Lymph": 39,
    "Neut": 52,
    "PLT": 261,
    "EF-TTE": 50,
    "Region RWMA": 0,
    "Sex": "Male",
    "VHD": "N",
}

encoded = preprocess_clinical_data(test_record)

print("Encoded feature count:", encoded.shape[1])
print("Expected feature count:", len(input_columns))
print("\nSelected categorical features:")

for feature in [
    "Sex_Male",
    "Obesity_Y",
    "DLP_Y",
    "BBB_N",
    "VHD_N",
]:
    print(f"{feature}: {encoded.iloc[0][feature]}")

print("\nAll features present:", list(encoded.columns) == input_columns)


print("\n--- HeartAI Model Predictions ---")

for name, model in __import__("app").models.items():
    features = __import__("app").selected_features[name]
    model_input = encoded[features]

    prediction = int(model.predict(model_input)[0])

    print(f"\n{name}:")
    print("Prediction:", prediction)
    print("Status:", "CAD / Stenotic" if prediction == 1 else "Normal")

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(model_input)[0]
        print("Probabilities:", probabilities)