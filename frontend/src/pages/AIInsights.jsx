import { useEffect , useState } from "react";
import {
Brain,
Activity,
Info,
Lightbulb,
ShieldCheck,
ChevronDown,
} from "lucide-react";

const models = [
{
name: "Overall CAD",
key: "Cath",
description: "Overall coronary artery disease classification.",
},
{
name: "LAD",
key: "LAD",
description: "Left anterior descending artery classification.",
},
{
name: "LCX",
key: "LCX",
description: "Left circumflex artery classification.",
},
{
name: "RCA",
key: "RCA",
description: "Right coronary artery classification.",
},
];

export default function AIInsights() {
const [activeModel, setActiveModel] = useState("Cath");
const [featureData, setFeatureData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");



useEffect(() => {
  let cancelled = false;

  async function fetchFeatureImportance() {
    setLoading(true);
    setError("");
    setFeatureData([]);

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/feature-importance/${activeModel}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch feature importance.");
      }

      const data = await response.json();

      if (!cancelled) {
        if (data.available) {
          setFeatureData(data.features);
        } else {
          setError(data.message || "Feature importance is unavailable.");
        }
      }
    } catch (err) {
      if (!cancelled) {
        setError(
          "Unable to connect to the backend. Make sure Flask is running."
        );
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  fetchFeatureImportance();

  return () => {
    cancelled = true;
  };
}, [activeModel]);

const selectedModel = models.find(
(model) => model.key === activeModel
);

return ( <div className="ai-insights-page"> <div className="page-intro"> <div> <div className="eyebrow"> <Brain size={15} />
MODEL INTERPRETABILITY </div>

```
      <h2>AI Insights</h2>

      <p>
        Explore how clinical features contribute to HeartAI's
        experimental coronary artery predictions.
      </p>
    </div>

    <div className="analysis-page-icon">
      <Brain size={28} />
    </div>
  </div>

  <div className="analysis-warning">
    <ShieldCheck size={20} />

    <div>
      <strong>Understand the model, not a medical diagnosis</strong>
      <p>
        Feature importance describes model behavior. It does not
        establish medical causation or individual patient risk.
      </p>
    </div>
  </div>

  <section className="insights-model-selector">
    <div>
      <span className="eyebrow">MODEL SELECTION</span>
      <h3>Choose a prediction model</h3>
      <p>Select a model to explore its explanations.</p>
    </div>

    <label className="insights-select">
      <span className="visually-hidden">Select model</span>

      <select
        value={activeModel}
        onChange={(event) => setActiveModel(event.target.value)}
      >
        {models.map((model) => (
          <option key={model.key} value={model.key}>
            {model.name}
          </option>
        ))}
      </select>

      <ChevronDown size={16} />
    </label>
  </section>

  <section className="insights-model-card">
    <div className="insights-card-icon">
      <Activity size={22} />
    </div>

    <div className="insights-card-content">
      <span className="eyebrow">SELECTED CLASSIFIER</span>
      <h3>{selectedModel.name}</h3>
      <p>{selectedModel.description}</p>
    </div>

    <span className="neutral-pill">
  {loading
    ? "Loading explanation..."
    : error
      ? "Explanation unavailable"
      : featureData.length > 0
        ? "Explanation available"
        : "No explanation available"}
</span>
  </section>

  <section className="feature-importance-panel">
    <div className="panel-header">
      <div>
        <div className="eyebrow">MODEL EXPLANATION</div>
        <h3>Feature importance</h3>
        <p>Global explanation of the selected classifier</p>
      </div>

      <div className="insights-card-icon">
        <Brain size={20} />
      </div>
    </div>

    
{loading ? (
  <div className="insights-empty-state">
    <div className="insights-empty-icon">
      <Brain size={28} />
    </div>
    <h3>Analyzing model...</h3>
    <p>Fetching feature importance from the trained model.</p>
  </div>
) : error ? (
  <div className="insights-empty-state">
    <div className="insights-empty-icon">
      <Info size={28} />
    </div>
    <h3>Explanation unavailable</h3>
    <p>{error}</p>
  </div>
) : featureData.length > 0 ? (
  <div className="feature-importance-list">
    {featureData.map((item, index) => {
      const maxImportance = Math.max(
        ...featureData.map((feature) => feature.importance),
        0.000001
      );

      const percentage = (item.importance / maxImportance) * 100;

      return (
        <div className="feature-importance-item" key={item.feature}>
          <div className="feature-importance-heading">
  <span className="feature-rank">
    #{index + 1}
  </span>

  <span className="feature-name">
    {item.feature.replaceAll("_", " ")}
  </span>

  <span className="feature-value">
    {item.importance.toFixed(4)}
  </span>
</div>

          <div className="feature-importance-track">
            <div
              className="feature-importance-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      );
    })}
  </div>
) : (
  <div className="insights-empty-state">
    <div className="insights-empty-icon">
      <Lightbulb size={28} />
    </div>
    <h3>No feature importance available</h3>
    <p>
      Feature importance has not been provided for this model yet.
    </p>
  </div>
)}

  </section>

  <section className="insights-note">
    <Info size={19} />

    <div>
      <strong>What will this page explain?</strong>

      <p>
        Global feature importance will show which inputs influence
        the model across its predictions. SHAP explanations can
        later help examine how individual features contribute to
        a particular prediction.
      </p>
    </div>
  </section>
</div>


);
}
