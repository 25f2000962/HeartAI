import {
BookOpen,
BrainCircuit,
Activity,
Database,
ShieldCheck,
BarChart3,
Code2,
AlertTriangle,
ArrowRight,
FileText,
} from "lucide-react";

export default function Documentation() {
const sections = [
{
id: "overview",
number: "01",
title: "Project Overview",
icon: <BrainCircuit size={20} />,
content:
"HeartAI is an experimental cardiovascular analysis and visualization platform that uses machine learning to explore coronary artery disease classification and vessel-specific predictions.",
},
{
id: "objectives",
number: "02",
title: "Objectives",
icon: <Activity size={20} />,
content:
"The project explores overall coronary artery disease classification and separate predictions for the LAD, LCX, and RCA targets. It combines model outputs with interactive visualizations and explanatory information.",
},
{
id: "dataset",
number: "03",
title: "Dataset & Features",
icon: <Database size={20} />,
content:
"The project uses the Z-Alizadeh Sani cardiovascular dataset, containing 303 records and 59 columns. Input features include demographic, clinical, laboratory, and cardiac examination variables. The prediction targets are Cath, LAD, LCX, and RCA.",
},
{
id: "models",
number: "04",
title: "Machine Learning Models",
icon: <BrainCircuit size={20} />,
content:
"HeartAI uses separate trained classifiers for the overall Cath target and the LAD, LCX, and RCA targets. The selected model pipeline depends on the target. Predictions and class probabilities are returned by the Flask backend.",
},
{
id: "visualization",
number: "05",
title: "Interactive Visualization",
icon: <BarChart3 size={20} />,
content:
"The dashboard presents model outputs, vessel-specific probabilities, performance metrics, and feature-importance information. The 3D heart is an anatomical visualization and does not identify an exact blockage location.",
},
{
id: "architecture",
number: "06",
title: "Technical Architecture",
icon: <Code2 size={20} />,
content:
"Frontend: React and Vite. Backend: Python and Flask. Machine learning: scikit-learn. The backend loads the saved model package, processes submitted clinical features, and returns prediction results through API endpoints.",
},
{
id: "interpretation",
number: "07",
title: "Understanding Results",
icon: <FileText size={20} />,
content:
"Class 1 probability represents the model's estimated probability for its encoded positive class. It is not automatically equivalent to an individual's clinical risk, a calibrated probability, or a measured percentage of artery blockage.",
},
{
id: "limitations",
number: "08",
title: "Limitations & Safety",
icon: <ShieldCheck size={20} />,
content:
"HeartAI is a research prototype developed using a small dataset. Its predictions are experimental and have not been established as clinically validated. Results must not be used to diagnose disease, determine treatment, or replace advice from a qualified healthcare professional.",
},
];
return ( <div className="documentation-page"> <div className="documentation-hero"> <div className="documentation-hero-icon"> <BookOpen size={26} /> </div>

    <span className="documentation-eyebrow">
      HEARTAI / KNOWLEDGE CENTER
    </span>

    <h1>Documentation</h1>

    <p>
      Explore the project's objectives, dataset, machine learning
      pipeline, dashboard features, technical architecture, and
      limitations.
    </p>

    <div className="documentation-meta">
      <span>
        <FileText size={15} /> Project Guide
      </span>
      <span>
        <ShieldCheck size={15} /> Research Prototype
      </span>
    </div>
  </div>

  <section className="documentation-toc">
    <div className="documentation-toc-heading">
      <div>
        <span className="documentation-section-number">
          QUICK NAVIGATION
        </span>
        <h2>On This Page</h2>
      </div>

      <BookOpen size={21} />
    </div>

    <div className="documentation-toc-links">
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`}>
          <span>{section.number}</span>
          {section.title}
          <ArrowRight size={14} />
        </a>
      ))}
    </div>
  </section>

  <div className="documentation-content">
    {sections.map((section) => (
      <section
        className="documentation-section"
        id={section.id}
        key={section.id}
      >
        <div className="documentation-section-heading">
          <div className="documentation-section-icon">
            {section.icon}
          </div>

          <div className="documentation-heading-text">
            <span className="documentation-section-number">
              SECTION {section.number}
            </span>
            <h2>{section.title}</h2>
          </div>
        </div>

        <p>{section.content}</p>
      </section>
    ))}

    <div className="documentation-notice">
      <AlertTriangle size={21} />

      <div>
        <strong>Important Medical Disclaimer</strong>
        <p>
          HeartAI is intended for educational and research purposes
          only. Its outputs are not medical diagnoses or validated
          clinical risk assessments. Consult a qualified healthcare
          professional for medical concerns.
        </p>
      </div>
    </div>
  </div>
</div>


);

}