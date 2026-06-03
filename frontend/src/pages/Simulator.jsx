import { useState, useEffect, useRef } from "react";
import TrafficGrid from "../components/TrafficGrid";
import MetricsCard from "../components/MetricsCard";
import { runSimulation, runOptimization } from "../api/client";
import "./Simulator.css";

export default function Simulator() {
  const [config, setConfig] = useState({
    grid_size: 4,
    sim_steps: 300,
    spawn_rate: 0.25,
    green_duration: 30,
    with_snapshots: true,
    snapshot_interval: 5,
    population_size: 10,
    generations: 5,
    swarm_size: 10,
    pso_iterations: 5,
    sa_initial_temp: 100.0,
    sa_iterations: 20,
  });

  // UI State: Top tabs are the Algorithms. Options are Random/Fixed.
  const [activeTab, setActiveTab] = useState("ga");
  const [simMode, setSimMode] = useState("random");
  // Stores the randomized params used in last random run, to display them
  const [lastRandomConfig, setLastRandomConfig] = useState(null);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const intervalRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSimMode("random");
    setResults(null);
    setShowMetrics(false);
    setLastRandomConfig(null);
  };

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setShowMetrics(false);
    setLastRandomConfig(null);

    try {
      let data;

      if (simMode === "fixed") {
        // Fixed: use exactly what the sliders say
        data = await runSimulation({
          ...config,
          algorithm: activeTab.toUpperCase(),
        });
        data.strategy = `${activeTab.toUpperCase()} — Fixed Values`;
      } else {
        // Random: randomize grid_size, sim_steps, spawn_rate alongside algorithm params
        const randomConfig = {
          ...config,
          grid_size: Math.floor(Math.random() * 5) + 2, // 2–6
          sim_steps: (Math.floor(Math.random() * 19) + 2) * 50, // 100–1000, step 50
          spawn_rate: Math.round((Math.random() * 0.45 + 0.05) * 100) / 100, // 0.05–0.50
          algorithm: activeTab.toUpperCase(),
          sim_mode: "random",
        };
        setLastRandomConfig(randomConfig);
        const rawData = await runOptimization(randomConfig);
        data = {
          ...rawData.best_chromosome.metrics,
          strategy: `${activeTab.toUpperCase()} — Random Values`,
          snapshots: rawData.best_chromosome.snapshots || [],
          // carry grid_size so TrafficGrid renders the correct grid
          _gridSize: randomConfig.grid_size,
        };
      }

      setResults(data);
      if (data.snapshots?.length > 0) {
        setIsPlaying(true);
      } else {
        setShowMetrics(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPlaying && results?.snapshots) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= results.snapshots.length - 1) {
            setIsPlaying(false);
            setShowMetrics(true);
            return prev;
          }
          return prev + 1;
        });
      }, 150);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, results]);

  // Use randomized grid_size for TrafficGrid if available, else config value
  const activeGridSize = results?._gridSize ?? config.grid_size;

  return (
    <div className="simulator-page page-container">
      <div className="container">
        <div className="page-header animate-fade-in">
          <h1>
            🚦 Traffic <span className="gradient-text">Simulator</span>
          </h1>
          <p>
            Run real-time traffic simulations with different timing strategies
            and visualize the results.
          </p>
        </div>

        <div className="sim-layout">
          {/* Controls Panel */}
          <div className="sim-controls glass-card animate-fade-in">
            <h3>Configuration</h3>

            {/* 3-TAB NAVIGATION */}
            <div
              className="tab-container"
              style={{
                display: "flex",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                marginBottom: "1.5rem",
              }}
            >
              <button
                onClick={() => handleTabChange("ga")}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  padding: "0.75rem",
                  color: activeTab === "ga" ? "#00ff88" : "var(--text-muted)",
                  borderBottom:
                    activeTab === "ga"
                      ? "2px solid #00ff88"
                      : "2px solid transparent",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1.05rem",
                }}
              >
                GA 🧬
              </button>
              <button
                onClick={() => handleTabChange("pso")}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  padding: "0.75rem",
                  color: activeTab === "pso" ? "#00d4ff" : "var(--text-muted)",
                  borderBottom:
                    activeTab === "pso"
                      ? "2px solid #00d4ff"
                      : "2px solid transparent",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1.05rem",
                }}
              >
                PSO 🐝
              </button>
              <button
                onClick={() => handleTabChange("sa")}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  padding: "0.75rem",
                  color: activeTab === "sa" ? "#ff4757" : "var(--text-muted)",
                  borderBottom:
                    activeTab === "sa"
                      ? "2px solid #ff4757"
                      : "2px solid transparent",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1.05rem",
                }}
              >
                SA 🔥
              </button>
            </div>

            {/* OPTIONS SUB-MENU: Random or Fixed */}
            <div
              className="simulation-options"
              style={{ marginBottom: "1.5rem" }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                {activeTab.toUpperCase()} Simulation Mode:
              </label>
              <div
                className="mode-toggle"
                style={{ display: "flex", gap: "0.5rem" }}
              >
                <button
                  className={`mode-btn ${simMode === "random" ? "active" : ""}`}
                  onClick={() => setSimMode("random")}
                  style={{ flex: 1 }}
                >
                  🎲 Random Values
                </button>
                <button
                  className={`mode-btn ${simMode === "fixed" ? "active" : ""}`}
                  onClick={() => setSimMode("fixed")}
                  style={{ flex: 1 }}
                >
                  📌 Fixed Values
                </button>
              </div>
            </div>

            <div className="control-fields">
              {simMode === "random" ? (
                /* Random mode: sliders are disabled, show what was actually used last run */
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    padding: "0.75rem",
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "6px",
                    lineHeight: "1.8",
                  }}
                >
                  🎲 <b>Parameters are randomized on each run.</b>
                  {lastRandomConfig && (
                    <div
                      style={{
                        marginTop: "0.5rem",
                        color: "var(--text-primary)",
                      }}
                    >
                      <b>Last run used:</b>
                      <br />
                      Grid: {lastRandomConfig.grid_size}×
                      {lastRandomConfig.grid_size}
                      &nbsp;·&nbsp; Steps: {lastRandomConfig.sim_steps}
                      &nbsp;·&nbsp; Spawn: {lastRandomConfig.spawn_rate}
                    </div>
                  )}
                </div>
              ) : (
                /* Fixed mode: full slider control */
                <>
                  <div className="input-group">
                    <label>Grid Size (N×N)</label>
                    <input
                      type="range"
                      min="2"
                      max="6"
                      value={config.grid_size}
                      onChange={(e) =>
                        setConfig({ ...config, grid_size: +e.target.value })
                      }
                    />
                    <span className="range-value">
                      {config.grid_size}×{config.grid_size}
                    </span>
                  </div>

                  <div className="input-group">
                    <label>Simulation Steps</label>
                    <input
                      type="range"
                      min="100"
                      max="1000"
                      step="50"
                      value={config.sim_steps}
                      onChange={(e) =>
                        setConfig({ ...config, sim_steps: +e.target.value })
                      }
                    />
                    <span className="range-value">{config.sim_steps}</span>
                  </div>

                  <div className="input-group">
                    <label>Spawn Rate</label>
                    <input
                      type="range"
                      min="0.05"
                      max="0.5"
                      step="0.05"
                      value={config.spawn_rate}
                      onChange={(e) =>
                        setConfig({ ...config, spawn_rate: +e.target.value })
                      }
                    />
                    <span className="range-value">{config.spawn_rate}</span>
                  </div>

                  <div className="input-group">
                    <label>Fixed Green Duration (seconds)</label>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      value={config.green_duration}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          green_duration: +e.target.value,
                        })
                      }
                    />
                    <span className="range-value">
                      {config.green_duration}s
                    </span>
                  </div>
                </>
              )}
            </div>

            <button
              className="btn btn-primary run-btn"
              onClick={handleRun}
              disabled={loading}
            >
              {loading ? "⏳ Computing..." : "▶ Run Simulation"}
            </button>

            {error && <div className="error-msg">⚠️ {error}</div>}
          </div>

          {/* Visualization */}
          <div
            className="sim-visual animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <TrafficGrid
              gridSize={activeGridSize}
              snapshots={results?.snapshots || []}
              currentStep={currentStep}
              isRunning={isPlaying}
              timingPlan={results?.timing_plan}
              width={560}
              height={560}
            />

            {results?.snapshots && (
              <div className="playback-controls">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setCurrentStep(0);
                    setIsPlaying(true);
                    setShowMetrics(false);
                  }}
                >
                  ⏮ Replay
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? "⏸ Pause" : "▶ Play"}
                </button>
                <span className="step-counter">
                  Step {results.snapshots[currentStep]?.step || 0} /{" "}
                  {results.snapshots[results.snapshots.length - 1]?.step || 0}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Metrics — only shows after animation completes */}
        {results && showMetrics && (
          <div className="sim-metrics animate-slide-up">
            <h3>
              Final Simulation Results —{" "}
              <span className="gradient-text">
                {results.strategy || "Baseline"}
              </span>
            </h3>
            <div className="grid-4">
              <MetricsCard
                icon="🚗"
                label="Throughput"
                value={results.throughput}
                unit="vehicles"
                color="var(--accent-green)"
              />
              <MetricsCard
                icon="⏱️"
                label="Avg Wait"
                value={results.avg_waiting_time}
                unit="s"
                color="var(--accent-yellow)"
              />
              <MetricsCard
                icon="📊"
                label="Avg Queue"
                value={results.avg_queue_length}
                color="var(--accent-cyan)"
              />
              <MetricsCard
                icon="🚫"
                label="Gridlock Penalty"
                value={results.gridlock_penalty}
                color="var(--accent-red)"
              />
              <MetricsCard
                icon="📦"
                label="Total Spawned"
                value={results.total_spawned}
                color="var(--accent-blue)"
              />
              <MetricsCard
                icon="✅"
                label="Completion Rate"
                value={results.completion_rate}
                unit="%"
                color="var(--accent-green)"
              />
              <MetricsCard
                icon="📈"
                label="Max Queue"
                value={results.max_queue_length}
                color="var(--accent-orange)"
              />
              <MetricsCard
                icon="🔄"
                label="Remaining"
                value={results.vehicles_remaining}
                color="var(--accent-purple)"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
