import { useState } from "react";
import MetricsCard from "../components/MetricsCard";
import ChartComponent from "../components/ChartComponent";
import TrafficGrid from "../components/TrafficGrid";
import { runOptimization } from "../api/client";
import "./Optimizer.css";

// ─── Per-algorithm metadata ───────────────────────────────────────────────────
const ALGO_META = {
  ga: {
    label: "GA",
    emoji: "🧬",
    color: "#00ff88",
    name: "Genetic Algorithm",
    iterLabel: "Gen",
    loadingText: "Running Genetic Algorithm Optimization...",
    btnText: "🧬 Run GA Optimization",
    busyText: "⏳ Evolving...",
    description:
      "Configure and run the Genetic Algorithm to search for high-quality traffic signal timing plans.",
    params: [
      {
        key: "population_size",
        label: "Population Size",
        min: 10,
        max: 100,
        step: 5,
      },
      { key: "generations", label: "Generations", min: 5, max: 200, step: 5 },
      {
        key: "crossover_rate",
        label: "Crossover Rate",
        min: 0.1,
        max: 1.0,
        step: 0.05,
      },
      {
        key: "mutation_rate",
        label: "Mutation Rate",
        min: 0.01,
        max: 0.5,
        step: 0.01,
      },
      { key: "elite_count", label: "Elite Count", min: 1, max: 10, step: 1 },
      {
        key: "tournament_size",
        label: "Tournament Size",
        min: 2,
        max: 10,
        step: 1,
      },
    ],
  },
  pso: {
    label: "PSO",
    emoji: "🐝",
    color: "#00d4ff",
    name: "Particle Swarm Optimization",
    iterLabel: "Iter",
    loadingText: "Running Particle Swarm Optimization...",
    btnText: "🐝 Run PSO Optimization",
    busyText: "⏳ Swarming...",
    description:
      "Configure and run Particle Swarm Optimization to search for high-quality traffic signal timing plans.",
    params: [
      { key: "swarm_size", label: "Swarm Size", min: 5, max: 100, step: 5 },
      { key: "pso_iterations", label: "Iterations", min: 5, max: 200, step: 5 },
      { key: "inertia", label: "Inertia (w)", min: 0.1, max: 1.0, step: 0.05 },
      {
        key: "cognitive",
        label: "Cognitive (c1)",
        min: 0.5,
        max: 3.0,
        step: 0.1,
      },
      { key: "social", label: "Social (c2)", min: 0.5, max: 3.0, step: 0.1 },
    ],
  },
  sa: {
    label: "SA",
    emoji: "🔥",
    color: "#ff4757",
    name: "Simulated Annealing",
    iterLabel: "Iter",
    loadingText: "Running Simulated Annealing Optimization...",
    btnText: "🔥 Run SA Optimization",
    busyText: "⏳ Annealing...",
    description:
      "Configure and run Simulated Annealing to search for high-quality traffic signal timing plans.",
    params: [
      {
        key: "sa_initial_temp",
        label: "Initial Temperature",
        min: 10,
        max: 1000,
        step: 10,
      },
      {
        key: "sa_cooling_rate",
        label: "Cooling Rate",
        min: 0.8,
        max: 0.99,
        step: 0.01,
      },
      {
        key: "sa_iterations",
        label: "Iterations",
        min: 10,
        max: 500,
        step: 10,
      },
      { key: "sa_restarts", label: "Restarts", min: 1, max: 10, step: 1 },
    ],
  },
};

// ─── Shared params shown for every algorithm ──────────────────────────────────
const SHARED_PARAMS = [
  { key: "grid_size", label: "Grid Size (N×N)", min: 2, max: 6, step: 1 },
  { key: "sim_steps", label: "Sim Steps", min: 100, max: 1000, step: 50 },
  { key: "spawn_rate", label: "Spawn Rate", min: 0.05, max: 0.5, step: 0.05 },
];

// ─── Default config covers all possible keys ─────────────────────────────────
const DEFAULT_CONFIG = {
  grid_size: 4,
  sim_steps: 500,
  spawn_rate: 0.3,
  // GA
  population_size: 30,
  generations: 50,
  crossover_rate: 0.8,
  mutation_rate: 0.1,
  elite_count: 2,
  tournament_size: 3,
  // PSO
  swarm_size: 30,
  pso_iterations: 50,
  inertia: 0.7,
  cognitive: 1.5,
  social: 1.5,
  // SA
  sa_initial_temp: 100,
  sa_cooling_rate: 0.95,
  sa_iterations: 100,
  sa_restarts: 3,
};

export default function Optimizer() {
  const [activeTab, setActiveTab] = useState(null);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const meta = activeTab ? ALGO_META[activeTab] : null;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResults(null);
    setError(null);
  };

  const handleOptimize = async () => {
    if (!activeTab) {
      setError("Select an algorithm to run.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await runOptimization({
        ...config,
        algorithm: activeTab.toUpperCase(),
      });
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const history = results?.history || [];
  const best = results?.best_chromosome;

  // Chart x-axis labels adapt to the algorithm's iteration terminology
  const xLabels = meta
    ? history.map(
        (h) => `${meta.iterLabel} ${h.generation ?? h.iteration ?? ""}`,
      )
    : [];

  const fitnessData = meta
    ? {
        labels: xLabels,
        datasets: [
          {
            label: "Best Fitness",
            data: history.map((h) => h.best_fitness),
            borderColor: meta.color,
            backgroundColor: meta.color + "1a",
            fill: true,
            tension: 0.4,
          },
          {
            label: "Avg Fitness",
            data: history.map((h) => h.avg_fitness),
            borderColor: "#7b2ff7",
            backgroundColor: "rgba(123,47,247,0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  const throughputData = meta
    ? {
        labels: xLabels,
        datasets: [
          {
            label: "Throughput",
            data: history.map((h) => h.best_metrics?.throughput || 0),
            borderColor: "#00ff88",
            backgroundColor: "rgba(0,255,136,0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  const waitingData = meta
    ? {
        labels: xLabels,
        datasets: [
          {
            label: "Avg Waiting Time",
            data: history.map((h) => h.best_metrics?.avg_waiting_time || 0),
            borderColor: "#ffa726",
            backgroundColor: "rgba(255,167,38,0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  const gridlockData = meta
    ? {
        labels: xLabels,
        datasets: [
          {
            label: "Gridlock Penalty",
            data: history.map((h) => h.best_metrics?.gridlock_penalty || 0),
            borderColor: "#ff4757",
            backgroundColor: "rgba(255,71,87,0.1)",
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

  // Loading hint line differs per algorithm
  const loadingHint = meta
    ? {
        ga: `Population: ${config.population_size} × Generations: ${config.generations}`,
        pso: `Swarm: ${config.swarm_size} × Iterations: ${config.pso_iterations}`,
        sa: `Temp: ${config.sa_initial_temp} → Cooling: ${config.sa_cooling_rate} × Iterations: ${config.sa_iterations}`,
      }[activeTab]
    : null;

  return (
    <div className="optimizer-page page-container">
      <div className="container">
        <div className="page-header animate-fade-in">
          {meta ? (
            <>
              <h1>
                {meta.emoji} <span className="gradient-text">{meta.name}</span>{" "}
                Optimizer
              </h1>
              <p>{meta.description}</p>
            </>
          ) : (
            <>
              <h1>
                ⚙️ <span className="gradient-text">Optimizer</span>
              </h1>
              <p>Select an algorithm to configure and run optimization.</p>
            </>
          )}
        </div>

        <div className="opt-layout">
          {/* ── Config Panel ─────────────────────────────────────────────── */}
          <div className="opt-config glass-card animate-fade-in">
            {/* Algorithm tabs */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                marginBottom: "1.25rem",
              }}
            >
              {Object.entries(ALGO_META).map(([key, m]) => (
                <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  style={{
                    flex: 1,
                    background: "none",
                    border: "none",
                    padding: "0.65rem 0",
                    color: activeTab === key ? m.color : "var(--text-muted)",
                    borderBottom:
                      activeTab === key
                        ? `2px solid ${m.color}`
                        : "2px solid transparent",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    transition: "color 0.2s",
                  }}
                >
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            {/* Shared params */}
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Shared Parameters
            </p>
            <div className="config-grid" style={{ marginBottom: "1rem" }}>
              {SHARED_PARAMS.map((param) => (
                <div key={param.key} className="input-group">
                  <label>{param.label}</label>
                  <div className="range-row">
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={config[param.key]}
                      onChange={(e) =>
                        setConfig({ ...config, [param.key]: +e.target.value })
                      }
                    />
                    <span className="range-value">
                      {param.key === "grid_size"
                        ? `${config[param.key]}×${config[param.key]}`
                        : config[param.key]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Algorithm-specific params */}
            {meta ? (
              <>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {meta.label} Parameters
                </p>
                <div className="config-grid">
                  {meta.params.map((param) => (
                    <div key={param.key} className="input-group">
                      <label>{param.label}</label>
                      <div className="range-row">
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step}
                          value={config[param.key] ?? param.min}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              [param.key]: +e.target.value,
                            })
                          }
                        />
                        <span className="range-value">
                          {config[param.key] ?? param.min}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Select an algorithm to view its parameters.
              </p>
            )}

            <button
              className="btn btn-primary run-btn"
              onClick={handleOptimize}
              disabled={loading || !meta}
              style={{ marginTop: "1.25rem", borderColor: meta?.color }}
            >
              {loading
                ? meta?.busyText
                : meta
                  ? meta.btnText
                  : "Select an Algorithm"}
            </button>

            {error && <div className="error-msg">⚠️ {error}</div>}

            {results && (
              <div className="opt-summary">
                <p className="summary-time">
                  ✅ Completed in <strong>{results.total_time}s</strong>
                </p>
              </div>
            )}
          </div>

          {/* ── Results Panel ─────────────────────────────────────────────── */}
          <div className="opt-results">
            {loading && meta && (
              <div className="opt-loading glass-card">
                <div className="spinner" />
                <p className="loading-text">{meta.loadingText}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {loadingHint}
                </p>
              </div>
            )}

            {best && meta && (
              <>
                <div className="grid-4 animate-fade-in">
                  <MetricsCard
                    icon="🏆"
                    label="Best Fitness"
                    value={best.fitness?.toFixed(2)}
                    color={meta.color}
                  />
                  <MetricsCard
                    icon="🚗"
                    label="Throughput"
                    value={best.metrics?.throughput}
                    color="var(--accent-green)"
                  />
                  <MetricsCard
                    icon="⏱️"
                    label="Avg Wait"
                    value={best.metrics?.avg_waiting_time}
                    unit="s"
                    color="var(--accent-yellow)"
                  />
                  <MetricsCard
                    icon="🚫"
                    label="Gridlock"
                    value={best.metrics?.gridlock_penalty}
                    color="var(--accent-red)"
                  />
                </div>

                <div className="charts-grid animate-slide-up">
                  {fitnessData && (
                    <ChartComponent
                      data={fitnessData}
                      title={`Fitness Over ${meta.iterLabel === "Gen" ? "Generations" : "Iterations"}`}
                    />
                  )}
                  {throughputData && (
                    <ChartComponent
                      data={throughputData}
                      title={`Throughput Over ${meta.iterLabel === "Gen" ? "Generations" : "Iterations"}`}
                    />
                  )}
                  {waitingData && (
                    <ChartComponent
                      data={waitingData}
                      title={`Waiting Time Over ${meta.iterLabel === "Gen" ? "Generations" : "Iterations"}`}
                    />
                  )}
                  {gridlockData && (
                    <ChartComponent
                      data={gridlockData}
                      title={`Gridlock Penalty Over ${meta.iterLabel === "Gen" ? "Generations" : "Iterations"}`}
                    />
                  )}
                </div>

                <div className="best-plan glass-card animate-fade-in">
                  <h3>Best Timing Plan</h3>
                  <p>
                    The optimal green-light durations (NS/EW seconds) for each
                    intersection found by <strong>{meta.name}</strong>:
                  </p>
                  <TrafficGrid
                    gridSize={config.grid_size}
                    timingPlan={best.timing_plan}
                    width={480}
                    height={480}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
