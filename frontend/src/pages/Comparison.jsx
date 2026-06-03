import { useState } from "react";
import ComparisonTable from "../components/ComparisonTable";
import ChartComponent from "../components/ChartComponent";
import MetricsCard from "../components/MetricsCard";
import { runComparison } from "../api/client";
import "./Comparison.css";

export default function Comparison() {
  const [config, setConfig] = useState({
    grid_size: 4,
    sim_steps: 500,
    spawn_rate: 0.3,
    fixed_green_duration: 30,
    ga_population_size: 30,
    ga_generations: 50,
    ga_crossover_rate: 0.8,
    ga_mutation_rate: 0.1,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await runComparison(config);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const barData = results
    ? {
        labels: [
          "Throughput",
          "Avg Wait Time",
          "Avg Queue",
          "Gridlock Penalty",
        ],
        datasets: [
          {
            label: "Genetic Algorithm (GA)",
            data: [
              results.ga_optimized?.throughput || 0,
              results.ga_optimized?.avg_waiting_time || 0,
              results.ga_optimized?.avg_queue_length || 0,
              results.ga_optimized?.gridlock_penalty || 0,
            ],
            backgroundColor: "rgba(0, 255, 136, 0.7)",
            borderColor: "#00ff88",
            borderWidth: 1,
          },
          {
            label: "Particle Swarm (PSO)",
            data: [
              results.pso_optimized?.throughput || 0,
              results.pso_optimized?.avg_waiting_time || 0,
              results.pso_optimized?.avg_queue_length || 0,
              results.pso_optimized?.gridlock_penalty || 0,
            ],
            backgroundColor: "rgba(0, 212, 255, 0.7)", // Cyan
            borderColor: "#00d4ff",
            borderWidth: 1,
          },
          {
            label: "Simulated Annealing (SA)",
            data: [
              results.sa_optimized?.throughput || 0,
              results.sa_optimized?.avg_waiting_time || 0,
              results.sa_optimized?.avg_queue_length || 0,
              results.sa_optimized?.gridlock_penalty || 0,
            ],
            backgroundColor: "rgba(255, 71, 87, 0.7)", // Red/Pink
            borderColor: "#ff4757",
            borderWidth: 1,
          },
        ],
      }
    : null;

  const gaHistory = results?.ga_history || [];
  const fitnessEvolution = results
    ? {
        labels: results.ga_history.map((h) => h.generation), // Assuming same number of iterations
        datasets: [
          {
            label: "GA Best Fitness",
            data: results.ga_history.map((h) => h.best_fitness),
            borderColor: "#00ff88",
            tension: 0.4,
          },
          {
            label: "PSO Best Fitness",
            data: results.pso_history.map((h) => h.best_fitness),
            borderColor: "#00d4ff",
            tension: 0.4,
          },
          {
            label: "SA Best Fitness",
            data: results.sa_history.map((h) => h.best_fitness),
            borderColor: "#ff4757",
            tension: 0.4,
          },
        ],
      }
    : null;

  return (
    <div className="comparison-page page-container">
      <div className="container">
        <div className="page-header animate-fade-in">
          <h1>
            ⚖️ Baseline <span className="gradient-text">Comparison</span>
          </h1>
          <p>
            Compare fixed timing and optimized strategies (GA, PSO, SA) side by
            side.
          </p>
        </div>

        {/* Config */}
        <div className="compare-config glass-card animate-fade-in">
          <h3>Comparison Parameters</h3>
          <div className="compare-params">
            <div className="input-group">
              <label>Grid Size</label>
              <input
                type="number"
                className="input-field"
                min="2"
                max="6"
                value={config.grid_size}
                onChange={(e) =>
                  setConfig({ ...config, grid_size: +e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label>Sim Steps</label>
              <input
                type="number"
                className="input-field"
                min="100"
                max="1000"
                step="50"
                value={config.sim_steps}
                onChange={(e) =>
                  setConfig({ ...config, sim_steps: +e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label>Spawn Rate</label>
              <input
                type="number"
                className="input-field"
                min="0.05"
                max="0.5"
                step="0.05"
                value={config.spawn_rate}
                onChange={(e) =>
                  setConfig({ ...config, spawn_rate: +e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label>GA Generations</label>
              <input
                type="number"
                className="input-field"
                min="5"
                max="200"
                step="5"
                value={config.ga_generations}
                onChange={(e) =>
                  setConfig({ ...config, ga_generations: +e.target.value })
                }
              />
            </div>
            <div className="input-group">
              <label>GA Population</label>
              <input
                type="number"
                className="input-field"
                min="10"
                max="100"
                step="5"
                value={config.ga_population_size}
                onChange={(e) =>
                  setConfig({ ...config, ga_population_size: +e.target.value })
                }
              />
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleCompare}
            disabled={loading}
            style={{ marginTop: "var(--space-lg)" }}
          >
            {loading
              ? "⏳ Running Comparison (Fixed → GA → PSO → SA)..."
              : "⚖️ Run Full Comparison"}
          </button>
          {error && <div className="error-msg">⚠️ {error}</div>}
        </div>

        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <p className="loading-text">
              Running fixed baseline and optimizers for comparison...
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
              This includes GA, PSO, and SA optimization runs
            </p>
          </div>
        )}

        {results && (
          <>
            {/* Strategy Summary */}
            {/* Strategy Summary */}
            <section className="compare-section animate-fade-in">
              <h2>Strategy Summary</h2>
              <div className="grid-3">
                <div className="strategy-card glass-card">
                  <div
                    className="strategy-header"
                    style={{ borderColor: "#00ff88" }}
                  >
                    <span className="strategy-icon">🧬</span>
                    <h3>GA Optimized</h3>
                  </div>
                  <p className="strategy-desc">
                    Genetic Algorithm (Evolutionary)
                  </p>
                  <div className="strategy-metrics">
                    <MetricsCard
                      icon="🚗"
                      label="Throughput"
                      value={results.ga_optimized?.throughput}
                      color="#00ff88"
                    />
                    <MetricsCard
                      icon="⏱️"
                      label="Avg Wait"
                      value={results.ga_optimized?.avg_waiting_time}
                      unit="s"
                      color="#00ff88"
                    />
                  </div>
                </div>

                <div className="strategy-card glass-card">
                  <div
                    className="strategy-header"
                    style={{ borderColor: "#00d4ff" }}
                  >
                    <span className="strategy-icon">🐝</span>
                    <h3>PSO Optimized</h3>
                  </div>
                  <p className="strategy-desc">
                    Particle Swarm (Swarm Intelligence)
                  </p>
                  <div className="strategy-metrics">
                    <MetricsCard
                      icon="🚗"
                      label="Throughput"
                      value={results.pso_optimized?.throughput}
                      color="#00d4ff"
                    />
                    <MetricsCard
                      icon="⏱️"
                      label="Avg Wait"
                      value={results.pso_optimized?.avg_waiting_time}
                      unit="s"
                      color="#00d4ff"
                    />
                  </div>
                </div>

                <div className="strategy-card glass-card neon-border">
                  <div
                    className="strategy-header"
                    style={{ borderColor: "#ff4757" }}
                  >
                    <span className="strategy-icon">🔥</span>
                    <h3>SA Optimized</h3>
                  </div>
                  <p className="strategy-desc">
                    Simulated Annealing (Trajectory-based)
                  </p>
                  <div className="strategy-metrics">
                    <MetricsCard
                      icon="🚗"
                      label="Throughput"
                      value={results.sa_optimized?.throughput}
                      color="#ff4757"
                    />
                    <MetricsCard
                      icon="⏱️"
                      label="Avg Wait"
                      value={results.sa_optimized?.avg_waiting_time}
                      unit="s"
                      color="#ff4757"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Comparison Table */}
            <section className="compare-section animate-slide-up">
              <h2>Detailed Comparison</h2>
              <ComparisonTable
                fixed={results.fixed}
                ga={results.ga_optimized}
                pso={results.pso_optimized}
                sa={results.sa_optimized}
              />
            </section>

            {/* Bar Chart */}
            <section className="compare-section animate-fade-in">
              <h2>Visual Comparison</h2>
              <div className="charts-grid">
                {barData && (
                  <ChartComponent
                    type="bar"
                    data={barData}
                    title="Strategy Comparison"
                  />
                )}
                {fitnessEvolution && (
                  <ChartComponent
                    data={fitnessEvolution}
                    title="Optimizer Fitness Evolution"
                  />
                )}
              </div>
            </section>

            {/* Verdict */}
            <section className="compare-section animate-slide-up">
              <div className="verdict-card glass-card neon-border">
                <h2>
                  🏆 Final <span className="gradient-text">Verdict</span>
                </h2>
                <p className="verdict-text">{results.verdict}</p>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
