import { useState } from "react";
import MetricsCard from "../components/MetricsCard";
import ChartComponent from "../components/ChartComponent";
import { runOptimization } from "../api/client";
import "./Dashboard.css";

// ─── Algorithm presets ────────────────────────────────────────────────────────
const ALGO_PRESETS = {
  GA: {
    emoji: "🧬",
    color: "#00ff88",
    iterLabel: "Gen",
    sectionTitle: "Evolution Progress",
    metaLabel: "Generations",
    metaIcon: "🧬",
    metaKey: "generations",
    metaKey2: "population_size",
    metaIcon2: "👥",
    metaLabel2: "Population",
    config: {
      grid_size: 4,
      population_size: 25,
      generations: 40,
      crossover_rate: 0.8,
      mutation_rate: 0.1,
      elite_count: 2,
      tournament_size: 3,
      sim_steps: 400,
      spawn_rate: 0.25,
      algorithm: "GA",
    },
  },
  PSO: {
    emoji: "🕊️",
    color: "#00d4ff",
    iterLabel: "Iter",
    sectionTitle: "Swarm Convergence",
    metaLabel: "Iterations",
    metaIcon: "🔁",
    metaKey: "pso_iterations",
    metaKey2: "swarm_size",
    metaIcon2: "🕊️",
    metaLabel2: "Swarm Size",
    config: {
      grid_size: 4,
      swarm_size: 25,
      pso_iterations: 40,
      inertia: 0.7,
      cognitive: 1.5,
      social: 1.5,
      sim_steps: 400,
      spawn_rate: 0.25,
      algorithm: "PSO",
    },
  },
  SA: {
    emoji: "🔥",
    color: "#ff4757",
    iterLabel: "Iter",
    sectionTitle: "Annealing Progress",
    metaLabel: "Iterations",
    metaIcon: "🔁",
    metaKey: "sa_iterations",
    metaKey2: "sa_initial_temp",
    metaIcon2: "🌡️",
    metaLabel2: "Init Temp",
    config: {
      grid_size: 4,
      sa_initial_temp: 100,
      sa_cooling_rate: 0.95,
      sa_iterations: 100,
      sa_restarts: 3,
      sim_steps: 400,
      spawn_rate: 0.25,
      algorithm: "SA",
    },
  },
};

export default function Dashboard() {
  const [selectedAlgo, setSelectedAlgo] = useState("GA");
  const [results, setResults] = useState(null);
  const [usedAlgo, setUsedAlgo] = useState(null); // algo that produced current results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuickRun = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    const preset = ALGO_PRESETS[selectedAlgo];
    try {
      const data = await runOptimization(preset.config);
      setResults(data);
      setUsedAlgo(selectedAlgo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const history = results?.history || [];
  const best = results?.best_chromosome;
  const meta = ALGO_PRESETS[usedAlgo || selectedAlgo];
  const xLabels = history.map(
    (h) => `${meta.iterLabel} ${h.generation ?? h.iteration ?? ""}`,
  );

  return (
    <div className="dashboard-page page-container">
      <div className="container">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div 
          className="page-header animate-fade-in" 
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}
        >
          <div style={{ flex: 1 }}>
            <h1>
              📊 Results <span className="gradient-text">Dashboard</span>
            </h1>
            <p>
              Comprehensive view of optimization results — metrics, convergence
              charts, and best timing plans across all three algorithms.
            </p>
          </div>
          
          {/* Download PDF Button - Only shows when there are results */}
          {results && (
            <button 
              className="btn print-btn" 
              onClick={() => window.print()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.2rem",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"}
              onMouseOut={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"}
            >
              📥 Download PDF
            </button>
          )}
        </div>

        {/* ── Empty / selector state ──────────────────────────────────────── */}
        {!results && !loading && (
          <div className="dashboard-empty glass-card animate-fade-in">
            <span className="empty-icon">📊</span>
            <h3>No Results Yet</h3>
            <p>
              Select an algorithm and run a quick optimization to populate the
              dashboard.
            </p>

            {/* Algorithm selector */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                margin: "1.25rem 0",
                flexWrap: "wrap",
              }}
            >
              {Object.entries(ALGO_PRESETS).map(([key, m]) => (
                <button
                  key={key}
                  onClick={() => setSelectedAlgo(key)}
                  style={{
                    padding: "0.6rem 1.4rem",
                    borderRadius: "8px",
                    border: `2px solid ${selectedAlgo === key ? m.color : "rgba(255,255,255,0.1)"}`,
                    background:
                      selectedAlgo === key ? m.color + "22" : "transparent",
                    color: selectedAlgo === key ? m.color : "var(--text-muted)",
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {m.emoji} {key}
                </button>
              ))}
            </div>

            <button
              className="btn btn-primary"
              onClick={handleQuickRun}
              disabled={loading}
              style={{ borderColor: ALGO_PRESETS[selectedAlgo].color }}
            >
              {ALGO_PRESETS[selectedAlgo].emoji} Quick {selectedAlgo} Run (4×4
              Grid)
            </button>

            {error && <div className="error-msg">⚠️ {error}</div>}
          </div>
        )}

        {/* ── Loading ─────────────────────────────────────────────────────── */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <p className="loading-text">
              Running {ALGO_PRESETS[selectedAlgo].emoji} {selectedAlgo}{" "}
              Optimization...
            </p>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────────────── */}
        {best && (
          <>
            {/* Re-run bar */}
            <div
              className="glass-card animate-fade-in"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.75rem 1.25rem",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Showing results for{" "}
                <strong style={{ color: meta.color }}>
                  {meta.emoji} {usedAlgo}
                </strong>
                {results.total_time && (
                  <>
                    {" "}
                    &mdash; completed in <strong>{results.total_time}s</strong>
                  </>
                )}
              </span>
              <div
                style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                {Object.entries(ALGO_PRESETS).map(([key, m]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedAlgo(key)}
                    style={{
                      padding: "0.35rem 0.9rem",
                      borderRadius: "6px",
                      border: `1.5px solid ${selectedAlgo === key ? m.color : "rgba(255,255,255,0.1)"}`,
                      background:
                        selectedAlgo === key ? m.color + "22" : "transparent",
                      color:
                        selectedAlgo === key ? m.color : "var(--text-muted)",
                      fontWeight: "bold",
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {m.emoji} {key}
                  </button>
                ))}
                <button
                  className="btn btn-primary"
                  onClick={handleQuickRun}
                  disabled={loading}
                  style={{ padding: "0.35rem 1rem", fontSize: "0.85rem" }}
                >
                  {loading ? "⏳" : "▶ Re-run"}
                </button>
              </div>
            </div>

            {/* Key Metrics */}
            <section className="dash-section animate-fade-in">
              <h2>Key Metrics</h2>
              <div className="grid-4">
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
                  unit="vehicles"
                  color="var(--accent-green)"
                />
                <MetricsCard
                  icon="⏱️"
                  label="Avg Waiting Time"
                  value={best.metrics?.avg_waiting_time}
                  unit="s"
                  color="var(--accent-yellow)"
                />
                <MetricsCard
                  icon="📊"
                  label="Avg Queue Length"
                  value={best.metrics?.avg_queue_length}
                  color="var(--accent-blue)"
                />
                <MetricsCard
                  icon="🚫"
                  label="Gridlock Penalty"
                  value={best.metrics?.gridlock_penalty}
                  color="var(--accent-red)"
                />
                <MetricsCard
                  icon={meta.metaIcon}
                  label={meta.metaLabel}
                  value={results.config?.[meta.metaKey]}
                  color="var(--accent-purple)"
                />
                <MetricsCard
                  icon={meta.metaIcon2}
                  label={meta.metaLabel2}
                  value={results.config?.[meta.metaKey2]}
                  color="var(--accent-orange)"
                />
                <MetricsCard
                  icon="⏰"
                  label="Total Time"
                  value={results.total_time}
                  unit="s"
                  color="var(--accent-cyan)"
                />
              </div>
            </section>

            {/* Charts */}
            <section className="dash-section animate-slide-up">
              <h2>{meta.sectionTitle}</h2>
              <div className="charts-grid">
                <ChartComponent
                  title={`Fitness Over ${meta.iterLabel === "Gen" ? "Generations" : "Iterations"}`}
                  data={{
                    labels: xLabels,
                    datasets: [
                      {
                        label: "Best",
                        data: history.map((h) => h.best_fitness),
                        borderColor: meta.color,
                        backgroundColor: meta.color + "1a",
                        fill: true,
                        tension: 0.4,
                      },
                      {
                        label: "Average",
                        data: history.map((h) => h.avg_fitness),
                        borderColor: "#7b2ff7",
                        backgroundColor: "rgba(123,47,247,0.1)",
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                />
                <ChartComponent
                  title={`Throughput Over ${meta.iterLabel === "Gen" ? "Generations" : "Iterations"}`}
                  data={{
                    labels: xLabels,
                    datasets: [
                      {
                        label: "Throughput",
                        data: history.map(
                          (h) => h.best_metrics?.throughput || 0,
                        ),
                        borderColor: "#00ff88",
                        backgroundColor: "rgba(0,255,136,0.1)",
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                />
                <ChartComponent
                  title={`Waiting Time Over ${meta.iterLabel === "Gen" ? "Generations" : "Iterations"}`}
                  data={{
                    labels: xLabels,
                    datasets: [
                      {
                        label: "Avg Waiting Time",
                        data: history.map(
                          (h) => h.best_metrics?.avg_waiting_time || 0,
                        ),
                        borderColor: "#ffa726",
                        backgroundColor: "rgba(255,167,38,0.1)",
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                />
                <ChartComponent
                  title={`Gridlock Penalty Over ${meta.iterLabel === "Gen" ? "Generations" : "Iterations"}`}
                  data={{
                    labels: xLabels,
                    datasets: [
                      {
                        label: "Gridlock Penalty",
                        data: history.map(
                          (h) => h.best_metrics?.gridlock_penalty || 0,
                        ),
                        borderColor: "#ff4757",
                        backgroundColor: "rgba(255,71,87,0.1)",
                        fill: true,
                        tension: 0.4,
                      },
                    ],
                  }}
                />
              </div>
            </section>

            {/* Best Timing Plan */}
            <section className="dash-section animate-fade-in">
              <h2>
                Best Timing Plan{" "}
                <span style={{ color: meta.color, fontSize: "0.85em" }}>
                  — {usedAlgo}
                </span>
              </h2>
              <div className="chromosome-display glass-card">
                <div className="timing-grid">
                  {best.timing_plan?.map((plan, i) => (
                    <div key={i} className="timing-cell">
                      <span className="timing-pos">
                        ({plan.intersection[0]},{plan.intersection[1]})
                      </span>
                      <span className="timing-ns">NS: {plan.ns_green}s</span>
                      <span className="timing-ew">EW: {plan.ew_green}s</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
