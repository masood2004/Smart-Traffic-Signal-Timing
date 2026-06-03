import time
import random
from typing import List, Dict, Optional
from backend.simulation.simulator import TrafficSimulator
# We can reuse Chromosome class to hold timings
from backend.ga.chromosome import Chromosome


class PSOOptimizer:
    def __init__(self, grid_size=4, swarm_size=30, iterations=50,
                 c1=1.5, c2=1.5, w=0.7, sim_steps=500, spawn_rate=0.3):
        self.grid_size = grid_size
        self.swarm_size = swarm_size
        self.iterations = iterations
        self.c1 = c1  # Cognitive parameter
        self.c2 = c2  # Social parameter
        self.w = w   # Inertia weight
        self.sim_steps = sim_steps
        self.spawn_rate = spawn_rate
        self.history = []
        self.global_best = None

    def run(self):
        start_time = time.time()
        # Initialize swarm (using Chromosome to hold random timing positions)
        from backend.ga.chromosome import create_random_population
        swarm = create_random_population(self.swarm_size, self.grid_size)

        # Initialize velocities (zero or random) and personal bests
        velocities = [[0] * len(p.genes) for p in swarm]
        personal_bests = [p.copy() for p in swarm]

        # Evaluate initial fitness
        for p in swarm:
            sim = TrafficSimulator(
                self.grid_size, p.get_timing_plan(), self.sim_steps, self.spawn_rate)
            results = sim.run()
            # Fitness: High throughput is good, high waiting time/gridlock is bad
            p.fitness = results["throughput"] - (
                results["avg_waiting_time"] * 0.5) - (results["gridlock_penalty"] * 10)
            p.metrics = results

            if self.global_best is None or p.fitness > self.global_best.fitness:
                self.global_best = p.copy()

        for it in range(self.iterations):
            it_start = time.time()
            for i in range(self.swarm_size):
                # Update velocity and position
                for j in range(len(swarm[i].genes)):
                    r1, r2 = random.random(), random.random()
                    velocities[i][j] = (self.w * velocities[i][j] +
                                        self.c1 * r1 * (personal_bests[i].genes[j] - swarm[i].genes[j]) +
                                        self.c2 * r2 * (self.global_best.genes[j] - swarm[i].genes[j]))

                    # Update position (must be integer for timings)
                    swarm[i].genes[j] = int(
                        max(10, min(120, swarm[i].genes[j] + velocities[i][j])))

                # Evaluate new position
                sim = TrafficSimulator(
                    self.grid_size, swarm[i].get_timing_plan(), self.sim_steps, self.spawn_rate)
                results = sim.run()
                swarm[i].fitness = results["throughput"] - \
                    (results["avg_waiting_time"] * 0.5) - \
                    (results["gridlock_penalty"] * 10)
                swarm[i].metrics = results

                # Update personal best
                if swarm[i].fitness > personal_bests[i].fitness:
                    personal_bests[i] = swarm[i].copy()

                # Update global best
                if swarm[i].fitness > self.global_best.fitness:
                    self.global_best = swarm[i].copy()

            self.history.append({
                "generation": it + 1,
                "best_fitness": round(self.global_best.fitness, 2),
                "best_metrics": self.global_best.metrics.copy(),
                "gen_time": round(time.time() - it_start, 3),
            })

        return {
            "best_chromosome": self.global_best.to_dict(),
            "history": self.history,
            "total_time": round(time.time() - start_time, 2),
            "algorithm": "PSO"
        }
