"""
Pydantic schemas for API request/response models.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any


class SimulationConfig(BaseModel):
    """Configuration for running a traffic simulation."""
    grid_size: int = Field(default=4, ge=2, le=8,
                           description="Grid size N for N×N grid")
    sim_steps: int = Field(default=500, ge=100, le=2000,
                           description="Simulation time steps")
    spawn_rate: float = Field(default=0.3, ge=0.05,
                              le=0.8, description="Vehicle spawn rate")
    green_duration: float = Field(
        default=30.0, ge=10, le=60, description="Fixed green duration")
    with_snapshots: bool = Field(
        default=False, description="Include state snapshots")
    snapshot_interval: int = Field(
        default=10, ge=1, le=50, description="Snapshot interval")


class OptimizeConfig(BaseModel):
    """Configuration for the Optimization algorithms."""
    algorithm: str = Field(
        default="GA", description="Algorithm to run: GA, PSO, or SA")
    grid_size: int = Field(default=4, ge=2, le=8)
    sim_steps: int = Field(default=500, ge=100, le=2000)
    spawn_rate: float = Field(default=0.3, ge=0.05, le=0.8)

    # GA Specific
    population_size: int = 30
    generations: int = 50
    crossover_rate: float = 0.8
    mutation_rate: float = 0.1
    elite_count: int = 2
    tournament_size: int = 3

    # PSO Specific
    swarm_size: int = 30
    pso_iterations: int = 50

    # SA Specific
    sa_initial_temp: float = 100.0
    sa_iterations: int = 50

    # 🚨 Simulator Visualization
    with_snapshots: bool = False
    snapshot_interval: int = 5


class ComparisonConfig(BaseModel):
    grid_size: int = 4
    sim_steps: int = 500
    spawn_rate: float = 0.3
    fixed_green_duration: int = 30

    # GA Parameters
    ga_population_size: int = 30
    ga_generations: int = 50
    ga_crossover_rate: float = 0.8
    ga_mutation_rate: float = 0.1

    # PSO Parameters
    pso_swarm_size: int = 30
    pso_iterations: int = 50

    # SA Parameters
    sa_initial_temp: float = 100.0
    sa_iterations: int = 50


class SimulationResult(BaseModel):
    """Result from a traffic simulation."""
    strategy: str
    description: str
    throughput: int
    total_spawned: int
    avg_waiting_time: float
    avg_queue_length: float
    max_queue_length: int
    gridlock_penalty: float
    total_gridlock_events: int
    completion_rate: float
    vehicles_remaining: int
    timing_plan: Optional[List[Dict]] = None
    snapshots: Optional[List[Dict]] = None


class GenerationResult(BaseModel):
    """Result from one GA generation (when GA is selected)."""
    generation: int
    best_fitness: float
    avg_fitness: float
    min_fitness: float
    max_fitness: float
    best_metrics: Dict[str, Any]
    best_timing_plan: List[Dict]
    gen_time: float


class GAResult(BaseModel):
    """GA optimization result (when GA is selected)."""
    best_chromosome: Dict[str, Any]
    history: List[Dict[str, Any]]
    total_time: float
    config: Dict[str, Any]


class ComparisonResult(BaseModel):
    """Result from baseline and optimizer comparison."""
    fixed: Dict[str, Any]
    ga_optimized: Dict[str, Any]
    pso_optimized: Dict[str, Any]
    sa_optimized: Dict[str, Any]
    verdict: str
    ga_history: List[Dict[str, Any]]
    pso_history: List[Dict[str, Any]]
    sa_history: List[Dict[str, Any]]


class ExportRequest(BaseModel):
    """Request to export results."""
    data: Dict[str, Any]
    format: str = Field(
        default="json", description="Export format: json or csv")
