# Project Explanation: MetaTraffic AI | Comparative Optimization

## Overview

**Project Title:** MetaTraffic AI | Comparative Optimization  
**Course:** Evolutionary Computing  
**Institution:** Dawood University of Engineering & Technology

This project is a comprehensive full-stack application designed to solve the critical problem of urban traffic congestion by dynamically optimizing traffic signal timing. Traditional signal systems rely on fixed-cycle timings that cannot adapt to fluctuating traffic densities, often leading to gridlocks, excessive wait times, and poor vehicle throughput.

To overcome these limitations, this project implements a **comparative optimization pipeline** that evaluates **Genetic Algorithm (GA)**, **Particle Swarm Optimization (PSO)**, and **Simulated Annealing (SA)** on the same $N \times N$ grid. By simulating traffic flows under various signal configurations and evaluating them based on key performance metrics, the system discovers high-performing timing strategies.

The project features a high-performance **Python/FastAPI backend** that hosts the optimizers and the discrete-event traffic simulator, paired with a modern, interactive **React frontend** that visualizes the traffic grid, tracks optimization behavior, and provides comparative analytics.

---

## The Problem Statement

In modern cities, intersections are the primary bottlenecks of traffic flow. A poorly timed traffic signal can cause a chain reaction, leading to long queues that spill over into adjacent intersections, creating a complete standstill known as gridlock.

The goal of this project is to optimize the duration of green lights for both North-South (NS) and East-West (EW) traffic flows at every intersection in an urban grid to achieve the following:

1. **Maximize Vehicle Throughput:** Increase the total number of vehicles that successfully navigate the grid and reach their destinations.
2. **Minimize Average Waiting Time:** Reduce the time vehicles spend idling at red lights.
3. **Minimize Average Queue Length:** Prevent large buildups of vehicles at any single intersection.
4. **Prevent Gridlocks:** Penalize and eliminate configurations that cause traffic flow to stop entirely.

---

## How It Works: Comparative Optimization Pipeline

The core of the system is a comparative pipeline that evaluates GA, PSO, and SA under identical simulation conditions. Each optimizer searches the same timing-plan space, while the simulator provides consistent metrics for fair comparison.

### 1. Timing Plan Representation

A **timing plan** represents a complete configuration for the entire $N \times N$ grid. It is encoded as a real-valued array of length $2 \times N \times N$.

- Each intersection requires two values: the green duration for the North-South (NS) phase and the East-West (EW) phase.
- **Constraints:** Every value is bounded between a minimum (e.g., 10 seconds) and a maximum (e.g., 60 seconds) duration to ensure realistic traffic cycles.

### 2. Initialization

Each optimizer begins with a diverse set of candidates:

- **GA:** A population of random timing plans
- **PSO:** A swarm of particles with positions and velocities
- **SA:** An initial timing plan with a temperature schedule

### 3. Evaluation (Fitness Function)

To determine how "good" a timing plan is, it is injected into the **discrete-event traffic simulator**. The simulator generates vehicles and models their movement through the grid based on the provided signal timings. After the simulation completes, metrics are extracted, and a weighted **Fitness Score** is calculated:

```text
Fitness = (w₁ × Throughput) − (w₂ × AvgWaitingTime) − (w₃ × AvgQueueLength) − (w₄ × GridlockPenalty)
```

_Higher fitness indicates a better timing plan._ The weights ($w_n$) are configurable to prioritize different goals (e.g., avoiding gridlock is heavily weighted).

### 4. Optimization Algorithms

- **GA:** Tournament selection, crossover, mutation, and elitism drive evolution of the population.
- **PSO:** Particles update velocity using inertia, cognitive, and social components to move toward good solutions.
- **SA:** Temperature-guided acceptance allows exploration early on and exploitation as the system cools.

### 5. Comparative Analysis

All optimizers are run under the same scenario, then compared against fixed and random baselines across throughput, waiting time, queue length, and gridlock penalty. The UI summarizes results with charts and verdicts.

---

## System Architecture

The project is built using a modern, decoupled client-server architecture.

### Backend (Python + FastAPI)

The backend is responsible for the heavy computational lifting. It is modularly structured:

- **`ga/` module:** Genetic Algorithm operators (`chromosome.py`, `fitness.py`, `selection.py`, `crossover.py`, `mutation.py`, `elitism.py`, `optimizer.py`).
- **`pso/` module:** Particle Swarm Optimization engine (`optimizer.py`).
- **`sa/` module:** Simulated Annealing engine (`optimizer.py`).
- **`simulation/` module:** A custom discrete-time traffic engine (`traffic_grid.py`, `vehicle.py`, `simulator.py`). It models grid topology, spawns vehicles, handles vehicle movement and queue logic, and tracks metrics.
- **`baselines/` module:** Provides "Fixed Timing" and "Random Timing" algorithms for comparative benchmarking.
- **`api/` module:** Exposes RESTful endpoints using FastAPI to allow the frontend to trigger simulations, run the optimizer, and fetch comparisons.

### Frontend (React + Vite + Chart.js)

The frontend provides a sleek, interactive user interface built with React. It features a "dark mode glassmorphism" design aesthetic.

- **Simulator View:** An HTML5 Canvas-based visualizer that renders the $N \times N$ grid, animates vehicle movements, and displays real-time signal phases and queue lengths based on simulation snapshots.
- **Optimizer Dashboard:** Allows users to configure GA/PSO/SA hyperparameters and view live charts (via Chart.js) of fitness progression across iterations.
- **Comparison Engine:** Side-by-side performance analysis of Fixed, Random, and GA/PSO/SA optimized timings, complete with automatically generated natural language verdicts.
- **Methodology & Documentation:** Academic-grade documentation integrated directly into the UI.

---

## Key Features & Accomplishments

- **Realistic Modeling:** The custom traffic simulator accurately models vehicle spawning, directional movement, queueing theory, and intersection signal phasing.
- **Configurable Architecture:** The GA, PSO, and SA optimizers and fitness weights are modular and easily interchangeable.
- **Dynamic Visualization:** The React application provides high-quality visualizations of both the optimization metrics and the physical traffic flow.
- **Submission-Ready:** The project is fully documented, structured according to software engineering best practices, and includes a comprehensive methodology report suitable for university-level evaluation.

---

## Project Team

- **Muhammad Fasih** (22F-BSCS-19)
- **Syed Masood Hussain** (22F-BSCS-26)
- **Syed Tehmeed Jafar** (22F-BSCS-11)
- **Zohair Raza** (22F-BSCS-29)
- **Nikhil Kumar** (22F-BSCS-31)

This project demonstrates the power of comparative metaheuristic optimization applied to complex, real-world, non-linear problems, showing that intelligent algorithms can significantly outperform static, rule-based systems in urban traffic management.
