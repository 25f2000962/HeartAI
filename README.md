# HeartAI ❤️

### Cardiovascular Risk Prediction and Visualization Dashboard

HeartAI is an experimental machine-learning application designed to explore cardiovascular disease prediction through an interactive dashboard. It combines clinical data processing, machine-learning models, vessel-specific predictions, and 3D heart visualization in one interface.

**Project Type:** AI / Machine Learning / Healthcare Visualization
**Status:** Research prototype

---

## Problem Statement

Cardiovascular disease assessment involves considering multiple clinical and physiological factors. Machine-learning models can help explore patterns in clinical datasets and present their predictions in an accessible format.

HeartAI aims to make these experimental predictions easier to explore through a dashboard that combines clinical inputs, prediction results, model performance information, and 3D anatomical visualization.

## Features

* **Clinical Data Input:** Enter demographic, clinical, laboratory, and related patient information.
* **CAD Prediction:** Generate an experimental prediction for the overall coronary artery disease target.
* **Vessel-Specific Predictions:** Explore predictions for the LAD, LCX, and RCA targets.
* **Interactive 3D Heart:** Rotate and zoom an anatomical heart model for visual exploration.
* **Prediction Dashboard:** View prediction results and associated model-generated probabilities.
* **AI Insights:** Explore model-related information and feature importance.
* **Model Performance:** Review experimental evaluation metrics.
* **Documentation:** Access information about the prototype and its limitations.

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* Three.js
* React Three Fiber
* React Three Drei
* Recharts
* Framer Motion
* Lucide React

### Backend

* Python
* Flask
* Flask-CORS
* NumPy
* Pandas
* Scikit-learn
* Joblib

### Machine Learning

The application loads previously trained models from a serialized model package. The package contains models for the overall CAD target and the LAD, LCX, and RCA targets.

The project uses the Z-Alizadeh Sani coronary artery disease dataset, which contains 303 records and 59 columns.

The prediction targets are:

* `Cath` — overall CAD-related target in the dataset
* `LAD` — left anterior descending artery target
* `LCX` — left circumflex artery target
* `RCA` — right coronary artery target

Target columns are excluded from the model's input features to prevent target leakage.

## Project Structure

```text
HeartAI/
├── app.py
├── heart_disease_package.pkl
├── heart_disease_package_backup.pkl
├── test_api.py
├── test_model.py
├── test_preprocessing.py
├── README.md
├── .gitignore
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── index.html
    ├── vite.config.js
    ├── models/
    │   ├── heart/
    │   └── ghosted-heart/
    ├── public/
    └── src/
        ├── App.jsx
        ├── App.css
        ├── HeartModel.jsx
        ├── index.css
        └── pages/
            ├── AIInsights.jsx
            ├── Documentation.jsx
            ├── ModelPerformance.jsx
            └── VesselAnalysis.jsx
```

## Prerequisites

Install the following before running HeartAI:

* Python 3.10 or another Python version compatible with the installed dependencies and serialized models
* Node.js and npm
* Git

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/25f2000962/HeartAI.git
cd HeartAI
```

### 2. Set up the Python environment

Create and activate a virtual environment.

**Windows PowerShell:**

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```powershell
python -m pip install flask flask-cors numpy pandas scikit-learn joblib
```

### 3. Start the Flask backend

From the project's root directory, run:

```powershell
python app.py
```

Keep this terminal open while using the application.

The backend should be available at:

`http://127.0.0.1:5000/`

### 4. Install frontend dependencies

Open a second terminal and navigate to the frontend directory:

```powershell
cd frontend
npm install
```

### 5. Start the frontend

From the `frontend` directory, run:

```powershell
npm run dev
```

Open the local address printed by Vite in your browser. It is typically:

`http://localhost:5173/`

Keep both the Flask backend and the Vite development server running while using HeartAI.

## API Endpoints

The Flask application provides endpoints including:

| Endpoint                           | Purpose                                                        |
| ---------------------------------- | -------------------------------------------------------------- |
| `/api/status`                      | Check backend status                                           |
| `/api/metadata`                    | Retrieve model or input metadata                               |
| `/api/predict-clinical`            | Generate predictions from clinical inputs                      |
| `/api/predict`                     | Generate predictions from encoded features                     |
| `/api/feature-importance/<target>` | Retrieve feature-importance information for a supported target |

The exact response fields are defined by the backend implementation.

## Responsible Use and Limitations

**HeartAI is an experimental research prototype, not a medical diagnostic system.**

* Predictions are generated by machine-learning models trained on a limited dataset.
* The dataset contains only 303 records, so model generalization is uncertain.
* Evaluation results are experimental and should not be interpreted as evidence of clinical effectiveness.
* Model-generated probabilities should not automatically be interpreted as calibrated clinical risk estimates.
* The 3D heart serves as an anatomical visualization reference. The predictions are not mapped to verified anatomical coordinates on individual artery meshes.
* The application has not been established as a clinically validated tool.

Do not use HeartAI to diagnose a person, make treatment decisions, or replace advice from a qualified healthcare professional.

## 3D Model Attribution

HeartAI includes third-party 3D anatomical models. Their original license files are retained in the corresponding model directories.

**Cardiac Anatomy: Coronary Arteries of the Heart**

* Creator: HannahNewey
* Source: https://sketchfab.com/3d-models/cardiac-anatomy-coronary-arteries-of-the-heart-00b5f4ec0b984325b453f8df07cd0cb5
* License: CC BY-NC-SA 4.0

**Coronary Arteries: Blood Supply to Ventricles**

* Creator: E-learning UMCG
* Source: https://sketchfab.com/3d-models/coronary-arteries-blood-supply-to-ventricles-60e1da3fbef542c6bcf61cdac312ce4f
* License: CC BY-NC-SA 4.0

These licenses require attribution, restrict commercial use, and impose share-alike requirements on adaptations. Consult the original licenses before redistributing adapted models or using them in a commercial context.

## Future Improvements

* More extensive model evaluation and validation
* Improved probability calibration
* Additional explainability and error-analysis tools
* More comprehensive automated testing
* Better integration between prediction outputs and anatomical visualization

## Disclaimer

HeartAI is developed for educational, research, and hackathon demonstration purposes. It is not intended to provide medical advice, diagnosis, or treatment recommendations.
