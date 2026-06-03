import time
import random
import math
from typing import Dict, Optional
from backend.simulation.simulator import TrafficSimulator
from backend.ga.chromosome import create_random_population, Chromosome


class SAOptimizer:
    def __init__(self, grid_size=4, initial_temp=100.0, cooling_rate=0.95,
                 iterations=50, sim_steps=500, spawn_rate=0.3):
        self.grid_size = grid_size
        self.initial_temp = initial_temp
        self.cooling_rate = cooling_rate
        self.iterations = iterations
        self.sim_steps = sim_steps
        self.spawn_rate = spawn_rate
        self.history = []
        self.best_state: Optional[Chromosome] = None

    def evaluate_fitness(self, state: Chromosome) -> float:
        sim = TrafficSimulator(
            self.grid_size, state.get_timing_plan(), self.sim_steps, self.spawn_rate)
        results = sim.run()
        state.metrics = results
        # Fitness formula: maximize throughput, minimize wait and gridlock
        fitness = results["throughput"] - \
            (results["avg_waiting_time"] * 0.5) - \
            (results["gridlock_penalty"] * 10)
        state.fitness = fitness
        return fitness

    def get_neighbor(self, state: Chromosome) -> Chromosome:
        neighbor = state.copy()
        # Randomly mutate 1 to 3 genes (timings)
        num_mutations = random.randint(1, 3)
        for _ in range(num_mutations):
            idx = random.randint(0, len(neighbor.genes) - 1)
            change = random.randint(-15, 15)
            # Ensure timing stays within realistic bounds (e.g., 10s to 120s)
            neighbor.genes[idx] = int(
                max(10, min(120, neighbor.genes[idx] + change)))
        return neighbor

    def run(self):
        start_time = time.time()

        # Initialize random starting state
        current_state = create_random_population(1, self.grid_size)[0]
        self.evaluate_fitness(current_state)
        self.best_state = current_state.copy()

        current_temp = self.initial_temp

        for i in range(self.iterations):
            it_start = time.time()

            # Generate and evaluate a neighbor
            neighbor = self.get_neighbor(current_state)
            self.evaluate_fitness(neighbor)

            # Decide whether to accept the neighbor
            delta = neighbor.fitness - current_state.fitness

            if delta > 0:
                # Better solution, accept it
                current_state = neighbor.copy()
                if current_state.fitness > self.best_state.fitness:
                    self.best_state = current_state.copy()
            else:
                # Worse solution, accept with a probability
                acceptance_probability = math.exp(
                    delta / current_temp) if current_temp > 0.01 else 0
                if random.random() < acceptance_probability:
                    current_state = neighbor.copy()

            # Cool down
            current_temp *= self.cooling_rate

            # Log history
            self.history.append({
                "generation": i + 1,
                "best_fitness": round(self.best_state.fitness, 2),
                "best_metrics": self.best_state.metrics.copy(),
                "temperature": round(current_temp, 2),
                "gen_time": round(time.time() - it_start, 3),
            })

        return {
            "best_chromosome": self.best_state.to_dict(),
            "history": self.history,
            "total_time": round(time.time() - start_time, 2),
            "algorithm": "SA"
        }
