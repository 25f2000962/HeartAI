import { useState, useEffect } from "react";
import HeartModel from "./HeartModel";
import VesselAnalysis from "./pages/VesselAnalysis";
import AIInsights from "./pages/AIInsights";
import ModelPerformance from "./pages/ModelPerformance";
import Documentation from "./pages/Documentation";
import {
  Activity,
  ArrowUpRight,
  ChevronDown,
  CircleHelp,
  Gauge,
  Heart,
  LayoutDashboard,
  Microscope,
  ScanHeart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { motion } from "framer-motion";
import "./App.css";

const vesselData = [
  { name: "LAD", fullName: "Left Anterior Descending", color: "#fb7185" },
  { name: "LCX", fullName: "Left Circumflex", color: "#a78bfa" },
  { name: "RCA", fullName: "Right Coronary Artery", color: "#38bdf8" },
];


function App() {
  const [activePage, setActivePage] = useState("Overview");
  const [activeVessel, setActiveVessel] = useState("LAD");
  const [latestPrediction, setLatestPrediction] = useState(null);
  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [activePage]);
  const predictionResults = latestPrediction?.predictions ?? {};

  const getClassOneProbability = (result) => {
    const probability = result?.probability?.["1"];
    return typeof probability === "number" && Number.isFinite(probability)
      ? probability
      : null;
  };

  const modelOutputData = ["Cath", "LAD", "LCX", "RCA"]
    .map((target) => {
      const probability = getClassOneProbability(predictionResults[target]);
      return probability === null
        ? null
        : { target, probability: Number((probability * 100).toFixed(1)) };
    })
    .filter(Boolean);

  const selectedVesselResult = predictionResults[activeVessel];
  const selectedVesselProbability = getClassOneProbability(selectedVesselResult);
  const navigation = [
    { name: "Overview", icon: LayoutDashboard },
    { name: "Vessel Analysis", icon: ScanHeart },
    { name: "AI Insights", icon: Sparkles },
    { name: "Model Performance", icon: Gauge },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Heart size={23} strokeWidth={2.2} />
          </div>

          <div>
            <h1>HeartAI</h1>
            <p>CARDIOVASCULAR INTELLIGENCE</p>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {navigation.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-item ${activePage === name ? "active" : ""}`}
              onClick={() => setActivePage(name)}
            >
              <Icon size={18} />
              <span>{name}</span>
              {activePage === name && <span className="active-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status">
            <span className="status-dot" />
            <div>
              <strong>System online</strong>
              <p>Prediction service UI</p>
            </div>
          </div>

                    <button
            className={`nav-item ${activePage === "Documentation" ? "active" : ""}`}
            onClick={() => setActivePage("Documentation")}
          >
            <CircleHelp size={18} />
            <span>Help & documentation</span>
          </button>

          <div className="profile">
            <div className="avatar">HA</div>
            <div className="profile-text">
              <strong>HeartAI Workspace</strong>
              <p>Research prototype</p>
            </div>
            
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {activePage}
          </div>

          <div className="topbar-actions">
            <div className="prototype-badge">
              <span className="status-dot" />
              DEVELOPMENT MODE
            </div>


            <div className="date-label">
              <Activity size={17} />
              <span>Cardiac Research</span>
            </div>
          </div>
        </header>

        <section className="page-content">
        {activePage === "Vessel Analysis" ? (
  <VesselAnalysis onPrediction={(data) => {
      setLatestPrediction(data);
      setActivePage("Overview");
    }}
  />
) : activePage === "AI Insights" ? (
  <AIInsights />
) : activePage === "Model Performance" ? (
  <ModelPerformance />
) :  activePage === "Documentation" ? (
          <Documentation />
        ) : (
  <>

          <motion.div
            className="welcome-section"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div>
              <div className="eyebrow">
                <Sparkles size={14} />
                AI-POWERED CARDIAC ANALYTICS
              </div>

              <h2>
                Cardiovascular
                <br />
                <span>intelligence, visualized.</span>
              </h2>

              <p className="welcome-description">
                Explore cardiac risk indicators and vessel-level predictions
                through an interactive clinical research interface.
              </p>
            </div>
            <button
  className="new-analysis-button"
  onClick={() => setActivePage("Vessel Analysis")}
>
  <Microscope size={17} />
  Analysis workspace
  <ArrowUpRight size={16} />
</button>
          </motion.div>

          <div className="notice">
            <ShieldCheck size={19} />

            <div>
              <strong>Research prototype</strong>
              <span>
                Results appear here after you run an experimental analysis. This interface is not a diagnostic tool.
              </span>
            </div>

            <span className="notice-tag">
              {latestPrediction ? "LATEST MODEL RESULTS" : "AWAITING ANALYSIS"}
            </span>
          </div>

          <div className="section-heading">
            <div>
              <h3>Cardiac overview</h3>
              <p>Your cardiovascular analytics at a glance</p>
            </div>

            <button className="period-button">
              {latestPrediction ? "Latest analysis" : "No analysis yet"} <ChevronDown size={15} />
            </button>
          </div>
<div className="metrics-grid">
  <motion.div
    className="metric-card"
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
  >
    <div className="metric-top">
      <span>CAD PREDICTION</span>
      <div className="metric-icon pink">
        <Heart size={19} />
      </div>
    </div>
<div className="metric-value">
  {latestPrediction?.predictions?.Cath?.status ?? "--"}
</div>

<p className="metric-caption">
  <span className="neutral-pill">
    {latestPrediction ? "Model response received" : "Awaiting analysis"}
  </span>
  Overall CAD classification
</p>

<div className="metric-footer">
  <span>Model: Cath</span>
  <span className="muted">
    {latestPrediction ? "Experimental result" : "Not evaluated"}
  </span>
</div>

</motion.div>

<motion.div
className="metric-card"
whileHover={{ y: -3 }}
transition={{ duration: 0.2 }}

>

<div className="metric-top">


  <span>VESSEL MODELS</span>
  <div className="metric-icon purple">
    <Activity size={19} />
  </div>
</div>

<div className="metric-value">03</div>

<p className="metric-caption">
  LAD · LCX · RCA
</p>

<div className="metric-footer">
  <span>Vessel classifiers</span>
  <span className="muted">
    {latestPrediction ? "Results received" : "Ready for analysis"}
  </span>
</div>


</motion.div>

<motion.div
className="metric-card"
whileHover={{ y: -3 }}
transition={{ duration: 0.2 }}

>


<div className="metric-top">



  <span>CLINICAL FEATURES</span>
  <div className="metric-icon blue">
    <Gauge size={19} />
  </div>
</div>

<div className="metric-value">54</div>

<p className="metric-caption">
  Available input features
</p>

<div className="metric-footer">
  <span>Preprocessed dataset</span>
  <span className="muted">Research data</span>
</div>


</motion.div>

</div>

          <div className="analysis-grid">
            <section className="panel heart-panel">
              <div className="panel-header">
                <div>
                  <div className="eyebrow">ANATOMICAL EXPLORER</div>
                  <h3>Coronary anatomy</h3>
                  <p>Explore the three major coronary vessels</p>
                </div>

                <span className="live-tag">
                  <span className="status-dot" />
                  INTERACTIVE 3D MODEL
                </span>
              </div>

              <div className="heart-visual">
                <div className="orbit orbit-one" />
                <div className="orbit orbit-two" />
                <div className="heart-glow" />
<div className="heart-placeholder">
  <HeartModel
  activeVessel={activeVessel}
  onVesselChange={setActiveVessel}
  prediction={latestPrediction}
/>
 
</div>

</div>


              
            </section>

            <section className="panel chart-panel">
              <div className="panel-header">
                <div>
                  <div className="eyebrow">MODEL OUTPUTS</div>
                  <h3>Class 1 probabilities</h3>
                  <p>
                    Model-reported probabilities for the latest submitted record
                  </p>
                </div>

                <div className="chart-icon">
                  <Activity size={18} />
                </div>
              </div>

              <div className="chart-summary">
                <div>
                  <span>{activeVessel} MODEL STATUS</span>
                  <strong>
                    {selectedVesselResult?.status ?? "--"}
                  </strong>
                </div>

                <span className="neutral-pill">
                  {selectedVesselProbability !== null &&
                  selectedVesselProbability !== undefined
                    ? `${(selectedVesselProbability * 100).toFixed(1)}% class 1`
                    : "No result yet"}
                </span>
              </div>

              <div className="chart-container">
                {modelOutputData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={modelOutputData}
                      margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="riskGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        stroke="#273047"
                        strokeDasharray="3 5"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="target"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#8590a8", fontSize: 11 }}
                        dy={10}
                      />

                      <YAxis
                        domain={[0, 100]}
                        unit="%"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#8590a8", fontSize: 11 }}
                      />

                      <Tooltip
                        formatter={(value) => [`${value}%`, "Class 1 probability"]}
                        contentStyle={{
                          background: "#151d2e",
                          border: "1px solid #303b52",
                          borderRadius: "10px",
                          color: "#f1f5f9",
                        }}
                      />

                      <Area
                        type="monotone"
                        dataKey="probability"
                        name="Class 1 probability"
                        stroke="#a78bfa"
                        strokeWidth={2.5}
                        fill="url(#riskGradient)"
                        activeDot={{ r: 5, fill: "#c4b5fd" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="prediction-placeholder">
                    <Activity size={22} />
                    <div>
                      <h3>No model outputs yet</h3>
                      <p>
                        Open Vessel Analysis, enter a record, and run the
                        experimental analysis to see probabilities here.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="chart-disclaimer">
                <ShieldCheck size={16} />
                <span>
                  Class 1 probabilities reflect model outputs, not a validated
                  clinical risk score or diagnosis.
                </span>
              </div>

              <div className="insight-box">
                <div className="insight-icon">
                  <Sparkles size={18} />
                </div>

                <div>
                  <strong>AI insights</strong>
                  <p>
                    The latest submitted record is passed to the Cath, LAD,
                    LCX, and RCA classifiers. Select a vessel to view its
                    returned classification and class 1 probability.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <footer className="footer">
            <div>
              <Heart size={15} />
              <span>HeartAI</span>
              <span className="footer-divider">·</span>
              <span>Multimodal AI Hackathon</span>
            </div>

            <span>
              Educational research prototype · Not for clinical use
            </span>
          </footer>
           </>
)}
        </section>
      </main>
    </div>
  );
}

export default App;