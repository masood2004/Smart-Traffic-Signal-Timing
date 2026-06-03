import "./Methodology.css";

export default function Methodology() {
  return (
    <div className="methodology-page page-container">
      <div className="container">
        <div className="page-header animate-fade-in">
          <h1>
            📝 Research <span className="gradient-text">Methodology</span>
          </h1>
          <p>
            Comparative documentation of the optimization pipeline and
            evaluation protocol.
          </p>
        </div>

        <div className="report-content animate-fade-in">
          {/* Problem Statement */}
          <section className="report-section glass-card">
            <h2>1. Problem Statement</h2>
            <p>
              Urban traffic congestion is a critical problem in modern cities,
              leading to increased travel time, fuel consumption, air pollution,
              and economic losses. Traditional traffic signal timing systems use
              fixed-cycle approaches that cannot adapt to varying traffic
              conditions, resulting in suboptimal performance during peak hours
              and off-peak periods alike.
            </p>
            <p>
              This project addresses the problem of optimizing traffic signal
              green-light durations across an N×N grid of intersections using
              comparative optimization techniques. The goal is to find signal
              timing plans that minimize vehicle waiting time, maximize
              throughput, reduce queue lengths, and prevent gridlock conditions.
            </p>
            <div className="highlight-box">
              <strong>Research Question:</strong> Can comparative metaheuristic
              optimization (GA, PSO, SA) outperform fixed and random timing
              baselines in throughput, waiting time, queue length, and
              congestion management?
            </div>
          </section>

          {/* Proposed Methodology */}
          <section className="report-section glass-card">
            <h2>2. Proposed Methodology</h2>
            <p>
              We evaluate multiple metaheuristic optimizers under identical
              simulation settings to ensure a fair comparison. Each algorithm
              searches for timing plans that maximize throughput and minimize
              delays and gridlock, using the same fitness function and
              simulator.
            </p>
            <div className="method-diagram">
              <div className="method-step">
                <span className="step-num">1</span>
                <span className="step-text">Define Scenario</span>
              </div>
              <span className="method-arrow">→</span>
              <div className="method-step">
                <span className="step-num">2</span>
                <span className="step-text">Select Algorithm</span>
              </div>
              <span className="method-arrow">→</span>
              <div className="method-step">
                <span className="step-num">3</span>
                <span className="step-text">Initialize Candidates</span>
              </div>
              <span className="method-arrow">→</span>
              <div className="method-step">
                <span className="step-num">4</span>
                <span className="step-text">Simulate & Score</span>
              </div>
              <span className="method-arrow">→</span>
              <div className="method-step">
                <span className="step-num">5</span>
                <span className="step-text">Iterate Search</span>
              </div>
              <span className="method-arrow">→</span>
              <div className="method-step">
                <span className="step-num">6</span>
                <span className="step-text">Compare & Report</span>
              </div>
            </div>
          </section>

          {/* Timing Plan Representation */}
          <section className="report-section glass-card">
            <h2>3. Timing Plan Representation</h2>
            <p>
              Each candidate solution represents a complete traffic signal
              timing plan for the entire N×N grid. For each intersection, there
              are two signal phases:
            </p>
            <ul>
              <li>
                <strong>NS Phase:</strong> Green duration for North-South
                traffic flow
              </li>
              <li>
                <strong>EW Phase:</strong> Green duration for East-West traffic
                flow
              </li>
            </ul>
            <p>
              The timing plan is encoded as a real-valued array of length{" "}
              <code>2 × N × N</code>, where each entry represents a green-light
              duration bounded between 10 and 60 seconds.
            </p>
            <div className="code-block">
              <pre>{`# Timing plan structure for a 4×4 grid (32 values)
timing_plan = [
  NS₍₀,₀₎, EW₍₀,₀₎,  # Intersection (0,0)
  NS₍₀,₁₎, EW₍₀,₁₎,  # Intersection (0,1)
  ...
  NS₍₃,₃₎, EW₍₃,₃₎,  # Intersection (3,3)
]

# Value bounds: 10 ≤ duration ≤ 60 (seconds)`}</pre>
            </div>
          </section>

          {/* Fitness Function */}
          <section className="report-section glass-card">
            <h2>4. Fitness Function</h2>
            <p>
              The fitness function evaluates each timing plan by running a
              discrete-time traffic simulation. The fitness score is computed
              as:
            </p>
            <div className="formula-box">
              <p className="formula">
                <strong>F</strong> = w₁ × Throughput − w₂ × AvgWaitingTime − w₃
                × AvgQueueLength − w₄ × GridlockPenalty
              </p>
            </div>
            <p>Where the default weights are:</p>
            <table className="params-table">
              <thead>
                <tr>
                  <th>Weight</th>
                  <th>Value</th>
                  <th>Objective</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>w₁ (Throughput)</td>
                  <td>2.0</td>
                  <td>Maximize vehicles completing journey</td>
                </tr>
                <tr>
                  <td>w₂ (Waiting Time)</td>
                  <td>1.0</td>
                  <td>Minimize average time spent waiting</td>
                </tr>
                <tr>
                  <td>w₃ (Queue Length)</td>
                  <td>0.5</td>
                  <td>Minimize average queue buildup</td>
                </tr>
                <tr>
                  <td>w₄ (Gridlock)</td>
                  <td>3.0</td>
                  <td>Heavily penalize gridlock situations</td>
                </tr>
              </tbody>
            </table>
            <p>Higher fitness values indicate better timing plans.</p>
          </section>

          {/* Optimization Algorithms */}
          <section className="report-section glass-card">
            <h2>5. Optimization Algorithms</h2>

            <h3>5.1 Genetic Algorithm (GA)</h3>
            <p>
              Population-based evolutionary search using selection, crossover,
              mutation, and elitism. Each generation improves candidate timing
              plans based on fitness feedback.
            </p>

            <h3>5.2 Particle Swarm Optimization (PSO)</h3>
            <p>
              Swarm-based optimization where particles update positions using
              personal and global bests. Velocity updates guide the search
              through the timing plan space.
            </p>

            <h3>5.3 Simulated Annealing (SA)</h3>
            <p>
              Trajectory-based stochastic search that accepts worse moves early
              on based on temperature, gradually cooling to refine high-quality
              solutions.
            </p>
          </section>

          {/* Simulation Setup */}
          <section className="report-section glass-card">
            <h2>6. Simulation Setup</h2>
            <p>
              The traffic simulation models an N×N grid of intersections
              connected by bidirectional roads. Key simulation features include:
            </p>
            <ul>
              <li>
                Vehicles spawn at grid edges traveling inward (North, South,
                East, West)
              </li>
              <li>
                Each intersection has two-phase signals (NS and EW) cycling
                based on the timing plan
              </li>
              <li>
                Vehicles proceed through green signals and queue at red signals
              </li>
              <li>
                Gridlock is detected when queue length exceeds a threshold (15
                vehicles)
              </li>
              <li>
                The simulation runs for a configurable number of time steps
                (default: 500)
              </li>
            </ul>
          </section>

          {/* Parameters */}
          <section className="report-section glass-card">
            <h2>7. Default Parameters</h2>
            <table className="params-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Default Value</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Grid Size</td>
                  <td>4×4</td>
                  <td>Number of intersections</td>
                </tr>
                <tr>
                  <td>Simulation Steps</td>
                  <td>500</td>
                  <td>Time steps per simulation run</td>
                </tr>
                <tr>
                  <td>Spawn Rate</td>
                  <td>0.3</td>
                  <td>Vehicle spawn probability per edge per step</td>
                </tr>
                <tr>
                  <td>Green Duration Range</td>
                  <td>[10, 60]s</td>
                  <td>Valid range for green durations</td>
                </tr>
                <tr>
                  <td>GA Population Size</td>
                  <td>30</td>
                  <td>Number of candidates in the GA population</td>
                </tr>
                <tr>
                  <td>GA Generations</td>
                  <td>50</td>
                  <td>Evolutionary iterations for GA</td>
                </tr>
                <tr>
                  <td>GA Crossover Rate</td>
                  <td>0.8</td>
                  <td>Probability of crossover</td>
                </tr>
                <tr>
                  <td>GA Mutation Rate</td>
                  <td>0.1</td>
                  <td>Per-gene mutation probability</td>
                </tr>
                <tr>
                  <td>GA Elite Count</td>
                  <td>2</td>
                  <td>Individuals preserved via elitism</td>
                </tr>
                <tr>
                  <td>GA Tournament Size</td>
                  <td>3</td>
                  <td>Selection tournament size</td>
                </tr>
                <tr>
                  <td>PSO Swarm Size</td>
                  <td>30</td>
                  <td>Number of particles in the swarm</td>
                </tr>
                <tr>
                  <td>PSO Iterations</td>
                  <td>50</td>
                  <td>Swarm update iterations</td>
                </tr>
                <tr>
                  <td>PSO Inertia (w)</td>
                  <td>0.7</td>
                  <td>Momentum of particle velocity</td>
                </tr>
                <tr>
                  <td>PSO Cognitive (c1)</td>
                  <td>1.5</td>
                  <td>Attraction to personal best</td>
                </tr>
                <tr>
                  <td>PSO Social (c2)</td>
                  <td>1.5</td>
                  <td>Attraction to global best</td>
                </tr>
                <tr>
                  <td>SA Initial Temperature</td>
                  <td>100</td>
                  <td>Starting temperature for annealing</td>
                </tr>
                <tr>
                  <td>SA Cooling Rate</td>
                  <td>0.95</td>
                  <td>Temperature decay per iteration</td>
                </tr>
                <tr>
                  <td>SA Iterations</td>
                  <td>100</td>
                  <td>Number of annealing iterations</td>
                </tr>
                <tr>
                  <td>SA Restarts</td>
                  <td>3</td>
                  <td>Independent annealing runs</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Results Summary */}
          <section className="report-section glass-card">
            <h2>8. Results Summary</h2>
            <p>The optimizers are compared against baseline strategies:</p>
            <ul>
              <li>
                <strong>Fixed Timing:</strong> All intersections use the same
                green duration (30s) for both phases
              </li>
              <li>
                <strong>Random Timing:</strong> Each intersection uses randomly
                assigned green durations
              </li>
              <li>
                <strong>GA Optimized:</strong> Best timing plan found by the
                Genetic Algorithm
              </li>
              <li>
                <strong>PSO Optimized:</strong> Best timing plan found by
                Particle Swarm Optimization
              </li>
              <li>
                <strong>SA Optimized:</strong> Best timing plan found by
                Simulated Annealing
              </li>
            </ul>
            <p>
              Results are evaluated across four metrics: throughput, average
              waiting time, average queue length, and gridlock penalty. The
              comparison page provides a real-time side-by-side evaluation with
              dynamically generated verdicts based on actual simulation results.
            </p>
          </section>

          {/* Conclusion */}
          <section className="report-section glass-card">
            <h2>9. Conclusion</h2>
            <p>
              This project demonstrates how multiple metaheuristic optimizers
              can be applied to the real-world problem of urban traffic signal
              timing optimization. By using a shared representation and
              simulation-driven fitness evaluation, GA, PSO, and SA can be
              compared under identical conditions.
            </p>
            <p>
              The modular architecture allows experimentation with different
              grid sizes, algorithm parameters, and traffic conditions. The
              interactive web interface enables researchers and traffic
              engineers to visualize the optimization process and compare
              strategies in real time.
            </p>
            <div className="highlight-box">
              <strong>Key Contribution:</strong> A complete, end-to-end
              comparative optimization pipeline for traffic signal timing — from
              shared representation and simulation-driven evaluation to
              multi-algorithm analysis and visualization.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
