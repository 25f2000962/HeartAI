
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Info,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const modelMetrics = [
  {
    name: "Overall CAD",
    key: "Cath",
    accuracy: 85.25,
    precision: 86.96,
    recall: 93.02,
    f1: 89.89,
    auc: 88.82,
  },
  {
    name: "LAD",
    key: "LAD",
    accuracy: 77.05,
    precision: 74.36,
    recall: 87.88,
    f1: 80.56,
    auc: 87.23,
  },
  {
    name: "LCX",
    key: "LCX",
    accuracy: 75.41,
    precision: 71.43,
    recall: 62.5,
    f1: 66.67,
    auc: 75.34,
  },
  {
    name: "RCA",
    key: "RCA",
    accuracy: 72.13,
    precision: 61.54,
    recall: 69.57,
    f1: 65.31,
    auc: 81.46,
  },
];

const chartData = modelMetrics.map((model) => ({
  model: model.key,
  Accuracy: model.accuracy,
  Precision: model.precision,
  Recall: model.recall,
  "F1-score": model.f1,
  "ROC-AUC": model.auc,
}));

export default function ModelPerformance() {
  const averageAccuracy =
    modelMetrics.reduce((sum, model) => sum + model.accuracy, 0) /
    modelMetrics.length;

  const averageAuc =
    modelMetrics.reduce((sum, model) => sum + model.auc, 0) /
    modelMetrics.length;

  return (
    <div className="model-performance-page">
      <div className="page-intro">
        <div>
          <div className="eyebrow">
            <BarChart3 size={15} />
            MODEL EVALUATION
          </div>

          <h2>Model Performance</h2>

          <p>
            Compare the measured performance of HeartAI's four
            experimental coronary classification models.
          </p>
        </div>

        <div className="analysis-page-icon">
          <TrendingUp size={28} />
        </div>
      </div>

      <div className="analysis-warning">
        <Info size={20} />

        <div>
          <strong>Provisional experimental results</strong>
          <p>
            These metrics were calculated on a recreated test split
            containing 61 records per target. The split has not yet
            been verified against the original model evaluation split.
            These results do not establish clinical reliability or
            readiness for medical use.
          </p>
        </div>
      </div>

      <div className="performance-summary-grid">
        <div className="performance-summary-card">
          <div className="performance-summary-top">
            <span>MODELS EVALUATED</span>
            <div className="insights-card-icon">
              <Activity size={20} />
            </div>
          </div>

          <strong className="performance-summary-value">04</strong>

          <p>Overall CAD and three coronary vessels</p>
        </div>

        <div className="performance-summary-card">
          <div className="performance-summary-top">
            <span>MEAN ACCURACY</span>
            <div className="insights-card-icon">
              <Target size={20} />
            </div>
          </div>

          <strong className="performance-summary-value">
            {averageAccuracy.toFixed(1)}%
          </strong>

          <p>Arithmetic mean across four models</p>
        </div>

        <div className="performance-summary-card">
          <div className="performance-summary-top">
            <span>MEAN ROC-AUC</span>
            <div className="insights-card-icon">
              <TrendingUp size={20} />
            </div>
          </div>

          <strong className="performance-summary-value">
            {averageAuc.toFixed(1)}%
          </strong>

          <p>Mean area under the ROC curve</p>
        </div>
      </div>

      <section className="performance-chart-panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">METRIC COMPARISON</div>
            <h3>Model evaluation overview</h3>
            <p>Scores shown as percentages</p>
          </div>

          <div className="insights-card-icon">
            <BarChart3 size={20} />
          </div>
        </div>

        <div className="performance-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 12, right: 12, left: -12, bottom: 4 }}
            >
              <CartesianGrid
                stroke="#273047"
                strokeDasharray="3 5"
                vertical={false}
              />

              <XAxis
                dataKey="model"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a0abc0", fontSize: 12 }}
              />

              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a0abc0", fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
              />

              <Tooltip
                formatter={(value) => [`${Number(value).toFixed(2)}%`]}
                contentStyle={{
                  background: "#151d2e",
                  border: "1px solid #303b52",
                  borderRadius: "10px",
                  color: "#f1f5f9",
                }}
              />

              <Bar
                dataKey="Accuracy"
                fill="#818cf8"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="Precision"
                fill="#fb7185"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="Recall"
                fill="#34d399"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="F1-score"
                fill="#c084fc"
                radius={[5, 5, 0, 0]}
              />

              <Bar
                dataKey="ROC-AUC"
                fill="#fbbf24"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="performance-legend">
          <span><i className="legend-accuracy" />Accuracy</span>
          <span><i className="legend-precision" />Precision</span>
          <span><i className="legend-recall" />Recall</span>
          <span><i className="legend-f1" />F1-score</span>
          <span><i className="legend-auc" />ROC-AUC</span>
        </div>
      </section>

      <section className="performance-table-panel">
        <div className="panel-header">
          <div>
            <div className="eyebrow">DETAILED RESULTS</div>
            <h3>Performance by model</h3>
            <p>Metrics calculated on the current test split</p>
          </div>

          <CheckCircle2 size={21} color="#34d399" />
        </div>

        <div className="performance-table-wrapper">
          <table className="performance-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1-score</th>
                <th>ROC-AUC</th>
              </tr>
            </thead>

            <tbody>
              {modelMetrics.map((model) => (
                <tr key={model.key}>
                  <td>
                    <strong>{model.name}</strong>
                  </td>

                  <td>{model.accuracy.toFixed(2)}%</td>
                  <td>{model.precision.toFixed(2)}%</td>
                  <td>{model.recall.toFixed(2)}%</td>
                  <td>{model.f1.toFixed(2)}%</td>
                  <td>{model.auc.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="insights-note">
        <Info size={19} />

        <div>
          <strong>How should these metrics be interpreted?</strong>

          <p>
            Accuracy measures the proportion of correct predictions.
            Precision measures how many positive predictions were
            correct, while recall measures how many actual positive
            cases were identified. F1-score balances precision and
            recall. ROC-AUC measures how well a model separates the
            two classes across classification thresholds.
          </p>
        </div>
      </section>
    </div>
  );
}

