
from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load trained model package
package = joblib.load("heart_disease_package.pkl")

models = package["models"]
selected_features = package["selected_features"]
input_columns = package["input_columns"]
# Original clinical fields used by the trained models.
clinical_columns = [
    "Age",
    "Weight",
    "Length",
    "BMI",
    "DM",
    "HTN",
    "Current Smoker",
    "EX-Smoker",
    "FH",
    "Obesity",
    "CRF",
    "CVA",
    "Airway disease",
    "Thyroid Disease",
    "CHF",
    "DLP",
    "BP",
    "PR",
    "Edema",
    "Weak Peripheral Pulse",
    "Lung rales",
    "Systolic Murmur",
    "Diastolic Murmur",
    "Typical Chest Pain",
    "Dyspnea",
    "Function Class",
    "Atypical",
    "Nonanginal",
    "LowTH Ang",
    "Q Wave",
    "St Elevation",
    "St Depression",
    "Tinversion",
    "LVH",
    "Poor R Progression",
    "BBB",
    "FBS",
    "CR",
    "TG",
    "LDL",
    "HDL",
    "BUN",
    "ESR",
    "HB",
    "K",
    "Na",
    "WBC",
    "Lymph",
    "Neut",
    "PLT",
    "EF-TTE",
    "Region RWMA",
    "Sex",
    "VHD",
]

@app.route("/")
def home():
    return """
    <h1>HeartAI</h1>
    <p>AI-powered heart health visualization prototype</p>
    <p>Four machine-learning models loaded successfully.</p>
    """


@app.route("/api/status")
def status():
    return jsonify({
        "status": "success",
        "models_loaded": list(models.keys()),
        "message": "HeartAI prediction service is running."
    })
@app.route("/api/metadata")
def metadata():
    return jsonify({
        "status": "success",
        "clinical_fields": clinical_columns,
        "encoded_feature_count": len(input_columns),
        "targets": list(models.keys())
    })


@app.route("/api/predict-clinical", methods=["POST"])
def predict_clinical():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Send clinical data as a JSON object."
        }), 400

    try:
        # Convert original clinical inputs into the model's
        # expected 57 encoded features.
        input_df = preprocess_clinical_data(data)

        predictions = {}

        # Run all four trained models.
        for name, model in models.items():
            features = selected_features[name]
            model_input = input_df[features]

            prediction = int(model.predict(model_input)[0])

            result = {
                "prediction": prediction,
                "status": (
                    "CAD / Stenotic"
                    if prediction == 1
                    else "Normal"
                )
            }

            # Include model probabilities when supported.
            if hasattr(model, "predict_proba"):
                probabilities = model.predict_proba(model_input)[0]

                result["probability"] = {
                    str(int(class_label)): float(probability)
                    for class_label, probability in zip(
                        model.classes_,
                        probabilities
                    )
                }

            predictions[name] = result

        return jsonify({
            "status": "success",
            "predictions": predictions,
            "disclaimer": (
                "Research prototype only. Predictions are "
                "experimental and are not a medical diagnosis."
            )
        })

    except (TypeError, ValueError) as error:
        return jsonify({
            "error": "Invalid or incomplete clinical data.",
            "details": str(error)
        }), 400

    except Exception:
        app.logger.exception("Clinical prediction failed")

        return jsonify({
            "error": "Prediction failed. Check the Flask server logs."
        }), 500
def preprocess_clinical_data(data):
    """
    Encode one clinical record using the exact feature columns
    expected by the trained HeartAI models.
    """

    # Validate that every original clinical field is supplied.
    missing_fields = [
        field
        for field in clinical_columns
        if field not in data or data[field] in (None, "")
    ]

    if missing_fields:
        raise ValueError(
            "Missing clinical fields: " + ", ".join(missing_fields)
        )

    # Build a DataFrame using the original clinical field names.
    raw_df = pd.DataFrame(
        [{field: data[field] for field in clinical_columns}]
    )

    # Correct the spelling inconsistency from the dataset.
    raw_df["Sex"] = raw_df["Sex"].replace(
        {"Fmale": "Female"}
    )

    # Create the numeric features first.
    encoded_df = pd.DataFrame(index=[0])

    categorical_values = {
        "Sex": ["Female", "Male"],
        "Obesity": ["N", "Y"],
        "CRF": ["N", "Y"],
        "CVA": ["N", "Y"],
        "Airway disease": ["N", "Y"],
        "Thyroid Disease": ["N", "Y"],
        "CHF": ["N", "Y"],
        "DLP": ["N", "Y"],
        "Weak Peripheral Pulse": ["N", "Y"],
        "Lung rales": ["N", "Y"],
        "Systolic Murmur": ["N", "Y"],
        "Diastolic Murmur": ["N", "Y"],
        "Dyspnea": ["N", "Y"],
        "Atypical": ["N", "Y"],
        "Nonanginal": ["N", "Y"],
        "LowTH Ang": ["N", "Y"],
        "LVH": ["N", "Y"],
        "Poor R Progression": ["N", "Y"],
        "BBB": ["LBBB", "N", "RBBB"],
        "VHD": ["Moderate", "N", "Severe", "mild"],
    }

    # Validate and encode categorical values using the original
    # reference categories implied by drop_first=True.
    for column, categories in categorical_values.items():
        value = str(raw_df.at[0, column])

        if value not in categories:
            raise ValueError(
                f"Invalid value for {column}: {value}. "
                f"Allowed values: {categories}"
            )

        for category in categories[1:]:
            feature_name = f"{column}_{category}"

            if feature_name in input_columns:
                encoded_df[feature_name] = int(value == category)

    # Copy numerical columns without changing their meaning.
    categorical_columns = list(categorical_values.keys())

    for column in clinical_columns:
        if column not in categorical_columns:
            encoded_df[column] = pd.to_numeric(
                raw_df.at[0, column],
                errors="raise"
            )

    # Match the exact column names and order used during training.
    encoded_df = encoded_df.reindex(
        columns=input_columns,
        fill_value=0
    )

    return encoded_df


@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Send clinical data as a JSON object."
        }), 400

    missing_features = [
        feature
        for feature in input_columns
        if feature not in data
    ]

    if missing_features:
        return jsonify({
            "error": "Some required clinical features are missing.",
            "missing_features": missing_features
        }), 400

    try:
        # Preserve the feature order used during training.
        input_df = pd.DataFrame(
            [[data[feature] for feature in input_columns]],
            columns=input_columns
        )

        # Ensure all feature values are numeric.
        input_df = input_df.apply(
            pd.to_numeric,
            errors="raise"
        )

        predictions = {}

        for name, model in models.items():
            features = selected_features[name]
            model_input = input_df[features]

            prediction = int(model.predict(model_input)[0])

            result = {
                "prediction": prediction,
                "status": (
                    "CAD / Stenotic"
                    if prediction == 1
                    else "Normal"
                )
            }

            if hasattr(model, "predict_proba"):
                probabilities = model.predict_proba(model_input)[0]

                result["probability"] = {
                    str(int(class_label)): float(probability)
                    for class_label, probability in zip(
                        model.classes_,
                        probabilities
                    )
                }

            predictions[name] = result

        return jsonify({
            "status": "success",
            "predictions": predictions,
            "disclaimer": (
                "Research prototype only. These predictions "
                "are not a medical diagnosis."
            )
        })

    except (TypeError, ValueError) as error:
        return jsonify({
            "error": "Invalid clinical feature values.",
            "details": str(error)
        }), 400

    except Exception:
        app.logger.exception("Prediction failed")

        return jsonify({
            "error": "Prediction failed. Check the server logs."
        }), 500


@app.route("/api/feature-importance/<target>", methods=["GET"])
def get_feature_importance(target):
    if target not in models:
        return jsonify({
            "error": "Invalid target. Use Cath, LAD, LCX, or RCA."
        }), 400
        # Use saved permutation importance for the LCX model
    if target == "LCX" and package.get("lcx_feature_importance"):
        return jsonify({
            "available": True,
            "target": "LCX",
            "method": "Permutation feature importance",
            "features": package["lcx_feature_importance"],
            "note": (
                "Exploratory model-behavior explanation. "
                "These values do not establish medical causation "
                "or individual patient risk."
            )
        })
    model = models[target]
    feature_names = selected_features[target]

    # Random Forest models
    if hasattr(model, "feature_importances_"):
        importance_values = model.feature_importances_
        method = "Built-in tree feature importance"

    # Pipeline model containing Logistic Regression
    elif hasattr(model, "named_steps"):
        classifier = model.named_steps.get("logisticregression")

        if classifier is not None and hasattr(classifier, "coef_"):
            importance_values = abs(classifier.coef_[0])
            method = "Absolute logistic regression coefficients"
        else:
            return jsonify({
                "available": False,
                "target": target,
                "message": "Feature importance is not available for this model yet."
            })

    else:
        return jsonify({
            "available": False,
            "target": target,
            "message": "Feature importance is not available for this model yet."
        })

    results = [
        {
            "feature": feature,
            "importance": float(value)
        }
        for feature, value in zip(feature_names, importance_values)
    ]

    results.sort(key=lambda item: item["importance"], reverse=True)

    return jsonify({
        "available": True,
        "target": target,
        "method": method,
        "features": results[:10],
        "note": (
            "These values describe model behavior, not medical causation "
            "or an individual patient's risk."
        )
    })

if __name__ == "__main__":
    app.run(debug=True)

