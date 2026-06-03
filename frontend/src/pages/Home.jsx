import { Link } from "react-router-dom";
import "./Home.css";

const features = [
  {
    icon: "🧠",
    title: "Comparative Optimization",
    desc: "Evaluate GA, PSO, and SA side by side to discover robust traffic signal timing plans.",
  },
  {
    icon: "🚦",
    title: "Traffic Simulation",
    desc: "Discrete-event simulation on an N×N intersection grid with realistic vehicle spawning and movement.",
  },
  {
    icon: "📊",
    title: "Real-Time Analytics",
    desc: "Run-by-run metrics: fitness, throughput, waiting time, queue length, and gridlock penalty.",
  },
  {
    icon: "⚖️",
    title: "Baseline Comparison",
    desc: "Compare fixed baselines against optimized strategies with visual charts and verdicts.",
  },
  {
    icon: "🗺️",
    title: "Visual Grid Simulator",
    desc: "Animated Canvas-based traffic grid showing intersections, signals, vehicles, and congestion in real time.",
  },
  {
    icon: "📝",
    title: "Research Methodology",
    desc: "Algorithm-agnostic report covering representation, evaluation metrics, and comparative results.",
  },
];

export default function Home() {
  return (
    <div className="home-page">
      <div className="bg-grid-pattern" />
      <div className="bg-radial-glow" />
      <div className="bg-radial-glow-2" />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content animate-fade-in">
            <div className="hero-badge badge badge-info">
              Comparative Optimization Project
            </div>
            <h1 className="hero-title">
              Comparative Optimization of
              <span className="gradient-text">
                {" "}
                Urban Traffic Signal Timing
              </span>
            </h1>
            <p className="hero-subtitle">
              Compare GA, PSO, and SA to discover optimal green-light durations
              for N×N intersection grids — reducing waiting time, improving
              throughput, and preventing gridlock through simulation-driven
              evaluation.
            </p>
            <div className="hero-actions">
              <Link to="/simulator" className="btn btn-primary">
                🚦 Launch Simulator
              </Link>
              <Link to="/optimizer" className="btn btn-secondary">
                ⚙️ Run Optimizer
              </Link>
              <Link to="/comparison" className="btn btn-secondary">
                ⚖️ View Comparison
              </Link>
            </div>
          </div>

          <div className="hero-stats animate-slide-up">
            <div className="stat-item">
              <span className="stat-value">N×N</span>
              <span className="stat-label">Grid Size</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">3</span>
              <span className="stat-label">Optimizers</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">2</span>
              <span className="stat-label">Baselines</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">Real</span>
              <span className="stat-label">Simulation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="page-header">
            <h2>
              Project <span className="gradient-text">Features</span>
            </h2>
            <p>
              A complete comparative optimization research simulator, not a
              basic assignment.
            </p>
          </div>
          <div className="features-grid grid-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="feature-card glass-card animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-section">
        <div className="container">
          <div className="page-header">
            <h2>
              How It <span className="gradient-text">Works</span>
            </h2>
            <p>
              A comparative pipeline evaluates multiple optimizers under
              identical conditions.
            </p>
          </div>
          <div className="steps-grid">
            {[
              {
                step: "01",
                title: "Define Scenario",
                desc: "Set grid size, simulation steps, and vehicle spawn rate for the experiment.",
              },
              {
                step: "02",
                title: "Select Optimizer",
                desc: "Choose GA, PSO, or SA and configure algorithm-specific parameters.",
              },
              {
                step: "03",
                title: "Search Timing Plans",
                desc: "Run the optimizer to explore candidate signal timings.",
              },
              {
                step: "04",
                title: "Evaluate Metrics",
                desc: "Simulate each plan and compute fitness, throughput, waiting time, and gridlock.",
              },
              {
                step: "05",
                title: "Compare Baselines",
                desc: "Benchmark against baseline strategies for context.",
              },
              {
                step: "06",
                title: "Report Insights",
                desc: "Visualize trends, export results, and review the best timing plan.",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="step-card glass-card animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="step-number">{s.step}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card glass-card neon-border">
            <h2>
              Ready to <span className="gradient-text">Optimize</span>?
            </h2>
            <p>Run GA, PSO, and SA optimizers and compare their outcomes.</p>
            <div className="hero-actions">
              <Link to="/optimizer" className="btn btn-primary">
                ⚙️ Start Optimizer
              </Link>
              <Link to="/methodology" className="btn btn-secondary">
                📝 Read Methodology
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
