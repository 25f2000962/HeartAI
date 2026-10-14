
import { Suspense, useMemo, useState ,useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center } from "@react-three/drei";
import {
  Activity,
  ArrowUpRight,
  BrainCircuit,
  CircleDot,
  HeartPulse,
  Orbit,
  Scan,
  ShieldCheck,
  Zap,
} from "lucide-react";

const VESSELS = {
  LAD: {
    name: "Left Anterior Descending",
    short: "Anterior artery",
    description:
      "Supplies a large portion of the front of the heart.",
    color: "#ff5478",
  },
  LCX: {
    name: "Left Circumflex",
    short: "Lateral artery",
    description:
      "Supplies parts of the lateral and posterior heart.",
    color: "#ad82ff",
  },
  RCA: {
    name: "Right Coronary Artery",
    short: "Right-side artery",
    description:
      "Supplies the right side and, in many people, the inferior heart.",
    color: "#35d9ff",
  },
};

function getResult(prediction, vessel) {
  return prediction?.predictions?.[vessel] ?? null;
}

function getProbability(result) {
  const raw = result?.probability?.["1"];

  if (typeof raw !== "number" || !Number.isFinite(raw)) {
    return null;
  }

  return Math.max(0, Math.min(100, raw * 100));
}

function getStatus(result) {
  return (
    result?.status ??
    result?.prediction ??
    "Awaiting analysis"
  );
}
function Heart() {
const { scene } = useGLTF("/models/heart/scene.gltf");

const clonedScene = useMemo(() => {
const clone = scene.clone(true);


clone.traverse((child) => {
  if (child.isMesh) {
    child.material = Array.isArray(child.material)
      ? child.material.map((material) => material.clone())
      : child.material.clone();
  }
}
)
;

return clone;


}, [scene]);

return ( <Center> <primitive object={clonedScene} scale={1.8} /> </Center>
);
}

function VesselCard({
  vesselKey,
  selected,
  result,
  onClick,
}) {
  const vessel = VESSELS[vesselKey];
  const probability = getProbability(result);
  const hasResult = probability !== null;

  return (
    <button
      type="button"
      className={`ai-vessel-card ${selected ? "is-selected" : ""}`}
      style={{ "--vessel-color": vessel.color }}
      onClick={onClick}
    >
      <div className="ai-vessel-card-top">
        <span className="ai-vessel-symbol">
          <Activity size={17} />
        </span>

        <span className="ai-vessel-arrow">
          <ArrowUpRight size={15} />
        </span>
      </div>

      <div className="ai-vessel-name">{vesselKey}</div>
      <div className="ai-vessel-full-name">{vessel.name}</div>

      <div className="ai-vessel-probability">
        {hasResult ? `${probability.toFixed(1)}%` : "--"}
        <span> class 1</span>
      </div>

      <div className="ai-vessel-progress">
        <span
          style={{
            width: `${probability ?? 0}%`,
          }}
        />
      </div>

      <div className="ai-vessel-status">
        <span className="ai-status-dot" />
        {getStatus(result)}
      </div>
    </button>
  );
}

export default function HeartModel({
  activeVessel = "LAD",
  onVesselChange,
  prediction,
}) {
  const [localVessel, setLocalVessel] = useState("LAD");

  const selectedVessel = onVesselChange
    ? activeVessel
    : localVessel;

  const selectedInfo = VESSELS[selectedVessel] ?? VESSELS.LAD;
  const selectedResult = getResult(prediction, selectedVessel);
  const selectedProbability = getProbability(selectedResult);

  const cadResult = getResult(prediction, "Cath");
  const cadProbability = getProbability(cadResult);

  function selectVessel(vessel) {
    setLocalVessel(vessel);
    onVesselChange?.(vessel);
  }

  return (
    <section className="ai-heart-explorer">
      <div className="ai-heart-topline">
        <div className="ai-heart-title">
          <div className="ai-heart-title-icon">
            <BrainCircuit size={21} />
          </div>

          <div>
            <div className="ai-kicker">HEARTAI / NEURAL VISUALIZATION</div>
            <h3>Coronary Intelligence Engine</h3>
            <p>Interactive anatomical model · Experimental predictions</p>
          </div>
        </div>

        <div className="ai-live-badge">
          <span />
          {prediction ? "RESULTS LOADED" : "SYSTEM STANDBY"}
        </div>
      </div>

      <div className="ai-heart-stage">
        <div className="ai-stage-grid" />
        <div className="ai-stage-glow" />
        <div className="ai-stage-ring ai-stage-ring-one" />
        <div className="ai-stage-ring ai-stage-ring-two" />

        <div className="ai-stage-coordinate coordinate-top">
          <CircleDot size={12} />
          ANATOMICAL SCAN / 3D
        </div>

        <div className="ai-stage-coordinate coordinate-bottom">
          <Orbit size={13} />
          DRAG TO ROTATE
        </div>

        <div className="ai-model-container">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 42 }}
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              powerPreference: "default",
              alpha: true,
            }}
            fallback={
              <p className="ai-canvas-error">
                Your browser does not support WebGL.
              </p>
            }
          >
            <ambientLight intensity={1.6} />

            <directionalLight
              position={[4, 5, 5]}
              intensity={2.4}
            />

            <pointLight
              position={[-4, 1, 3]}
              intensity={2.2}
              color="#ff456d"
            />

            <pointLight
              position={[4, -2, -1]}
              intensity={1.5}
              color="#3d7cff"
            />

            <Suspense fallback={null}>
              <Heart />
            </Suspense>

            <OrbitControls
              enablePan={false}
              enableZoom
              autoRotate
              autoRotateSpeed={0.45}
              minDistance={2.5}
              maxDistance={8}
              makeDefault
            />
          </Canvas>
        </div>

        <div className="ai-floating-label ai-label-lad">
          <span className="ai-label-marker" />
          <div>
            <strong>LAD</strong>
            <small>ANTERIOR</small>
          </div>
          <span className="ai-label-value">
            {getProbability(getResult(prediction, "LAD")) !== null
              ? `${getProbability(getResult(prediction, "LAD")).toFixed(1)}%`
              : "--"}
          </span>
        </div>

        <div className="ai-floating-label ai-label-lcx">
          <span className="ai-label-marker" />
          <div>
            <strong>LCX</strong>
            <small>CIRCUMFLEX</small>
          </div>
          <span className="ai-label-value">
            {getProbability(getResult(prediction, "LCX")) !== null
              ? `${getProbability(getResult(prediction, "LCX")).toFixed(1)}%`
              : "--"}
          </span>
        </div>

        <div className="ai-floating-label ai-label-rca">
          <span className="ai-label-marker" />
          <div>
            <strong>RCA</strong>
            <small>RIGHT CORONARY</small>
          </div>
          <span className="ai-label-value">
            {getProbability(getResult(prediction, "RCA")) !== null
              ? `${getProbability(getResult(prediction, "RCA")).toFixed(1)}%`
              : "--"}
          </span>
        </div>

        <div className="ai-stage-corner ai-corner-left">
          <span>MODEL</span>
          <strong>HEART-04</strong>
        </div>

        <div className="ai-stage-corner ai-corner-right">
          <span>VISUALIZATION</span>
          <strong>REAL-TIME UI</strong>
        </div>
      </div>

      <div className="ai-vessel-section-heading">
        <div>
          <div className="ai-kicker">VESSEL CLASSIFIERS</div>
          <h4>Coronary analysis</h4>
        </div>

        <div className="ai-selection-hint">
          <Scan size={15} />
          SELECT A VESSEL
        </div>
      </div>

      <div className="ai-vessel-cards">
        {Object.keys(VESSELS).map((key) => (
          <VesselCard
            key={key}
            vesselKey={key}
            selected={selectedVessel === key}
            result={getResult(prediction, key)}
            onClick={() => selectVessel(key)}
          />
        ))}
      </div>

      <div
        className="ai-selected-panel"
        style={{ "--vessel-color": selectedInfo.color }}
      >
        <div className="ai-selected-icon">
          <HeartPulse size={23} />
        </div>

        <div className="ai-selected-description">
          <span className="ai-kicker">SELECTED VESSEL</span>
          <h4>{selectedInfo.name}</h4>
          <p>{selectedInfo.description}</p>
        </div>

        <div className="ai-selected-stat">
          <span>CLASS 1 PROBABILITY</span>
          <strong>
            {selectedProbability === null
              ? "--"
              : `${selectedProbability.toFixed(1)}%`}
          </strong>
          <small>
            {selectedResult
              ? getStatus(selectedResult)
              : "No result available"}
          </small>
        </div>
      </div>

      <div className="ai-cad-summary">
        <div className="ai-cad-icon">
          <Zap size={18} />
        </div>

        <div className="ai-cad-copy">
          <span className="ai-kicker">OVERALL MODEL OUTPUT</span>
          <strong>CAD classification</strong>
          <small>
            Cath classifier · Experimental research output
          </small>
        </div>

        <div className="ai-cad-result">
          <strong>{getStatus(cadResult)}</strong>
          <span>
            {cadProbability === null
              ? "Probability unavailable"
              : `${cadProbability.toFixed(1)}% class 1`}
          </span>
        </div>
      </div>

      <div className="ai-research-note">
        <ShieldCheck size={17} />
        <p>
          Research prototype only. Class 1 probabilities and classifications
          are experimental model outputs, not validated clinical risk scores.
          This visualization must not be used for diagnosis or treatment.
          The vessel labels do not imply that the corresponding arteries
          have been individually highlighted in the 3D anatomy.
        </p>
      </div>
    </section>
  );
}

useGLTF.preload("/models/heart/scene.gltf");
