import requests

url = "http://127.0.0.1:5000/api/predict-clinical"

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

try:
    response = requests.post(url, json=test_record, timeout=15)


    print("HTTP Status:", response.status_code)
    result = response.json()
    print("API Response:")
    print(result)

    if response.ok:
        predictions = result.get("predictions", {})

        print("\n--- Prediction Summary ---")

        for name, output in predictions.items():
            print(f"{name}: {output['status']}")

        expected_models = {"Cath", "LAD", "LCX", "RCA"}

        if set(predictions.keys()) == expected_models:
            print("\nSUCCESS: All four models responded through the API!")
        else:
            print("\nCheck: The response does not contain all four expected models.")


except requests.exceptions.ConnectionError:
    print("Could not connect to Flask. Check that app.py is running.")

except requests.exceptions.RequestException as error:
    print("Request failed:", error)
