import { useEffect, useState } from "react";
import {
Activity,
HeartPulse,
RotateCcw,
ShieldAlert,
LoaderCircle,
AlertCircle,
CheckCircle2,
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000";

const categoricalOptions = {
Sex: ["Female", "Male"],
Obesity: ["N", "Y"],
CRF: ["N", "Y"],
CVA: ["N", "Y"],
"Airway disease": ["N", "Y"],
"Thyroid Disease": ["N", "Y"],
CHF: ["N", "Y"],
DLP: ["N", "Y"],
"Weak Peripheral Pulse": ["N", "Y"],
"Lung rales": ["N", "Y"],
"Systolic Murmur": ["N", "Y"],
"Diastolic Murmur": ["N", "Y"],
Dyspnea: ["N", "Y"],
Atypical: ["N", "Y"],
Nonanginal: ["N", "Y"],
"LowTH Ang": ["N", "Y"],
LVH: ["N", "Y"],
"Poor R Progression": ["N", "Y"],
BBB: ["LBBB", "N", "RBBB"],
VHD: ["Moderate", "N", "Severe", "mild"],
};

const fieldGroups = [
{
title: "Patient Information",
description: "Demographics and body measurements",
fields: ["Age", "Sex", "Weight", "Length", "BMI"],
},
{
title: "Medical History",
description: "Existing conditions and relevant history",
fields: [
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
],
},
{
title: "Symptoms and Examination",
description: "Clinical findings and physical examination",
fields: [
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
],
},
{
title: "ECG Findings",
description: "Electrocardiogram-related features",
fields: [
"Q Wave",
"St Elevation",
"St Depression",
"Tinversion",
"LVH",
"Poor R Progression",
"BBB",
],
},
{
title: "Laboratory Results",
description: "Blood tests and biochemical measurements",
fields: [
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
],
},
{
title: "Cardiac Assessment",
description: "Echocardiography and valve-related findings",
fields: ["EF-TTE", "Region RWMA", "VHD"],
},
];

const binaryFields = new Set([
"DM",
"HTN",
"Current Smoker",
"EX-Smoker",
"FH",
"Edema",
"Typical Chest Pain",
"Q Wave",
"St Elevation",
"St Depression",
"Tinversion",
"Region RWMA",
]);

const fieldLabels = {
Age: "Age (years)",
Sex: "Sex",
Weight: "Weight (kg)",
Length: "Height (cm)",
BMI: "BMI",
DM: "Diabetes",
HTN: "Hypertension",
"Current Smoker": "Current smoker",
"EX-Smoker": "Former smoker",
FH: "Family history",
Obesity: "Obesity",
CRF: "Chronic renal failure",
CVA: "Cerebrovascular accident history",
"Airway disease": "Airway disease",
"Thyroid Disease": "Thyroid disease",
CHF: "Congestive heart failure",
DLP: "Dyslipidemia",
BP: "Blood pressure",
PR: "Pulse rate",
Edema: "Edema",
"Weak Peripheral Pulse": "Weak peripheral pulse",
"Lung rales": "Lung rales",
"Systolic Murmur": "Systolic murmur",
"Diastolic Murmur": "Diastolic murmur",
"Typical Chest Pain": "Typical chest pain",
Dyspnea: "Dyspnea",
"Function Class": "Functional class",
Atypical: "Atypical chest pain",
Nonanginal: "Non-anginal chest pain",
"LowTH Ang": "Low-threshold angina",
"Q Wave": "Q wave",
"St Elevation": "ST elevation",
"St Depression": "ST depression",
Tinversion: "T-wave inversion",
LVH: "Left ventricular hypertrophy",
"Poor R Progression": "Poor R-wave progression",
BBB: "Bundle branch block",
FBS: "Fasting blood sugar",
CR: "Creatinine",
TG: "Triglycerides",
LDL: "LDL cholesterol",
HDL: "HDL cholesterol",
BUN: "Blood urea nitrogen",
ESR: "ESR",
HB: "Hemoglobin",
K: "Potassium",
Na: "Sodium",
WBC: "White blood cell count",
Lymph: "Lymphocytes",
Neut: "Neutrophils",
PLT: "Platelet count",
"EF-TTE": "Ejection fraction (TTE)",
"Region RWMA": "Regional wall-motion abnormality",
VHD: "Valvular heart disease",
};

function makeEmptyForm(fields) {
return Object.fromEntries(fields.map((field) => [field, ""]));
}

function getFieldType(field) {
if (categoricalOptions[field] || binaryFields.has(field)) {
return "select";
}

return "number";
}

function FieldInput({ field, value, onChange }) {
const label = fieldLabels[field] || field;
const options = categoricalOptions[field];

if (options) {
return ( <label className="form-field" key={field}> <span>{label}</span>
<select
name={field}
value={value}
onChange={(event) => onChange(field, event.target.value)}
required
> <option value="">Select value</option>
{options.map((option) => ( <option value={option} key={option}>
{option} </option>
))} </select> </label>
);
}

if (binaryFields.has(field)) {
return ( <label className="form-field" key={field}> <span>{label}</span>
<select
name={field}
value={value}
onChange={(event) => onChange(field, event.target.value)}
required
> <option value="">Select value</option> <option value="0">No (0)</option> <option value="1">Yes (1)</option> </select> </label>
);
}

return ( <label className="form-field" key={field}> <span>{label}</span>
<input
type="number"
name={field}
value={value}
onChange={(event) => onChange(field, event.target.value)}
step="any"
required
/> </label>
);
}

export default function VesselAnalysis({ onPrediction }) {
const [clinicalFields, setClinicalFields] = useState([]);
const [form, setForm] = useState({});
const [predictions, setPredictions] = useState(null);
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [metadataLoading, setMetadataLoading] = useState(true);
const sampleRecord = {
  Age: 53,
  Weight: 90,
  Length: 175,
  BMI: 29.387755102040817,
  DM: 0,
  HTN: 1,
  "Current Smoker": 1,
  "EX-Smoker": 0,
  FH: 0,
  Obesity: "Y",
  CRF: "N",
  CVA: "N",
  "Airway disease": "N",
  "Thyroid Disease": "N",
  CHF: "N",
  DLP: "Y",
  BP: 110,
  PR: 80,
  Edema: 0,
  "Weak Peripheral Pulse": "N",
  "Lung rales": "N",
  "Systolic Murmur": "N",
  "Diastolic Murmur": "N",
  "Typical Chest Pain": 0,
  Dyspnea: "N",
  "Function Class": 0,
  Atypical: "N",
  Nonanginal: "N",
  "LowTH Ang": "N",
  "Q Wave": 0,
  "St Elevation": 0,
  "St Depression": 1,
  Tinversion: 1,
  LVH: "N",
  "Poor R Progression": "N",
  BBB: "N",
  FBS: 90,
  CR: 0.7,
  TG: 250,
  LDL: 155,
  HDL: 30,
  BUN: 8,
  ESR: 7,
  HB: 15.6,
  K: 4.7,
  Na: 141,
  WBC: 5700,
  Lymph: 39,
  Neut: 52,
  PLT: 261,
  "EF-TTE": 50,
  "Region RWMA": 0,
  Sex: "Male",
  VHD: "N",
};

const loadSampleRecord = () => {
  const sampleForm = {};

  clinicalFields.forEach((field) => {
    sampleForm[field] = String(sampleRecord[field] ?? "");
  });

  setForm(sampleForm);
  setPredictions(null);
  setError("");
};
useEffect(() => {
let cancelled = false;


async function loadMetadata() {
  try {
    const response = await fetch(`${API_URL}/api/metadata`);

    if (!response.ok) {
      throw new Error("Could not load clinical field information.");
    }

    const data = await response.json();

    if (!Array.isArray(data.clinical_fields)) {
      throw new Error("The backend returned invalid field information.");
    }

    if (!cancelled) {
      setClinicalFields(data.clinical_fields);
      setForm(makeEmptyForm(data.clinical_fields));
    }
  } catch {
    if (!cancelled) {
      setError(
        "Unable to connect to the HeartAI backend. Make sure Flask is running."
      );
    }
  } finally {
    if (!cancelled) {
      setMetadataLoading(false);
    }
  }
}

loadMetadata();

return () => {
  cancelled = true;
};


}, []);

function handleChange(field, value) {
setForm((previous) => ({
...previous,
[field]: value,
}));


setPredictions(null);
setError("");


}

function handleReset() {
setForm(makeEmptyForm(clinicalFields));
setPredictions(null);
setError("");
}

async function handleSubmit(event) {
event.preventDefault();
setError("");
setPredictions(null);
setLoading(true);


try {
  const payload = {};

  for (const field of clinicalFields) {
    const value = form[field];

    if (value === undefined || value === "") {
      throw new Error(`Please enter a value for ${field}.`);
    }

    if (getFieldType(field) === "number") {
      const numberValue = Number(value);

      if (!Number.isFinite(numberValue)) {
        throw new Error(`Please enter a valid number for ${field}.`);
      }

      payload[field] = numberValue;
    } else if (binaryFields.has(field)) {
      payload[field] = Number(value);
    } else {
      payload[field] = value;
    }
  }

  const response = await fetch(`${API_URL}/api/predict-clinical`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.details || data.error || "The prediction request failed."
    );
  }

 setPredictions(data);
onPrediction?.(data); 
} catch (requestError) {
  setError(
    requestError.message ||
      "An unexpected error occurred while requesting predictions."
  );
} finally {
  setLoading(false);
}


}

return ( <div className="vessel-analysis-page"> <div className="page-intro"> <div> <div className="eyebrow"> <Activity size={15} />
CORONARY ANALYSIS WORKSPACE </div>


      <h2>Vessel Analysis</h2>

      <p>
        Enter the available clinical dataset values to run the
        experimental HeartAI models.
      </p>
    </div>

    <div className="analysis-page-icon">
      <HeartPulse size={28} />
    </div>
  </div>

  <div className="analysis-warning">
    <ShieldAlert size={20} />

    <div>
      <strong>Research prototype — not a diagnostic tool</strong>
      <p>
        Predictions are experimental, may be inaccurate, and must not
        be used to make medical decisions.
      </p>
    </div>
  </div>

  {metadataLoading ? (
    <div className="prediction-placeholder">
      <LoaderCircle size={22} className="spin" />
      <div>
        <h3>Loading clinical fields</h3>
        <p>Connecting to the HeartAI backend...</p>
      </div>
    </div>
  ) : (
    <form className="clinical-form" onSubmit={handleSubmit}>
            <div className="sample-record-banner">
        <div>
          <strong>Want to test HeartAI?</strong>
          <p>
            Fill the form with one example record from the research dataset.
          </p>
        </div>

        <button
          type="button"
          className="sample-button"
          onClick={loadSampleRecord}
          disabled={loading || metadataLoading}
        >
          Load Sample Record
        </button>
      </div>
      <div className="form-section-heading">
        <div>
          <span className="eyebrow">
            {clinicalFields.length} CLINICAL FEATURES
          </span>
          <h3>Clinical information</h3>
          <p>
            Enter all required values from a consistent clinical dataset
            record. Do not guess missing values.
          </p>
        </div>
      </div>

      {fieldGroups.map((group, index) => {
        const fields = group.fields.filter((field) =>
          clinicalFields.includes(field)
        );

        if (fields.length === 0) return null;

        return (
          <section className="clinical-field-section" key={group.title}>
            <div className="form-section-heading">
              <div>
                <span className="eyebrow">
                  {String(index + 1).padStart(2, "0")} / CLINICAL DATA
                </span>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
              </div>
            </div>

            <div className="form-grid">
              {fields.map((field) => (
                <FieldInput
                  key={field}
                  field={field}
                  value={form[field] ?? ""}
                  onChange={handleChange}
                />
              ))}
            </div>
          </section>
        );
      })}

      <div className="form-actions">
        <button
          type="button"
          className="reset-button"
          onClick={handleReset}
          disabled={loading}
        >
          <RotateCcw size={16} />
          Reset form
        </button>

        <button
          type="submit"
          className="new-analysis-button"
          disabled={loading || clinicalFields.length === 0}
        >
          {loading ? (
            <LoaderCircle size={17} className="spin" />
          ) : (
            <Activity size={17} />
          )}
          {loading ? "Analyzing..." : "Run experimental analysis"}
        </button>
      </div>
    </form>
  )}

  {error && (
    <div className="analysis-error" role="alert">
      <AlertCircle size={20} />
      <div>
        <strong>Analysis could not be completed</strong>
        <p>{error}</p>
      </div>
    </div>
  )}

  {predictions && (
    <section className="prediction-results">
      <div className="form-section-heading">
        <div>
          <span className="eyebrow">
            <CheckCircle2 size={14} /> MODEL RESPONSE RECEIVED
          </span>
          <h3>Experimental prediction results</h3>
          <p>
            These outputs describe the model's classifications for the
            submitted record, not a medical diagnosis.
          </p>
        </div>
      </div>

      <div className="prediction-results-grid">
        {Object.entries(predictions.predictions || {}).map(
          ([name, result]) => {
            const classOneProbability = result.probability?.["1"];

            return (
              <article className="prediction-result-card" key={name}>
                <span className="eyebrow">
                  {name === "Cath"
                    ? "OVERALL CAD"
                    : `${name} CORONARY ARTERY`}
                </span>

                <h4>{result.status}</h4>

                <p>
                  {classOneProbability !== undefined
                    ? `Model-reported class 1 probability: ${(classOneProbability * 100).toFixed(1)}%`
                    : "Probability not provided by this model."}
                </p>
              </article>
            );
          }
        )}
      </div>

      <div className="analysis-warning">
        <ShieldAlert size={20} />
        <div>
          <strong>Research use only</strong>
          <p>
            {predictions.disclaimer ||
              "Experimental output only; not for diagnosis or treatment decisions."}
          </p>
        </div>
      </div>
    </section>
  )}
</div>


);
}
