"""
API routes for the MetaTraffic AI backend.

Provides endpoints for:
- Running traffic simulations
- Running GA/PSO/SA optimization
- Comparing fixed baselines and optimized strategies
- Exporting results
- Getting default configuration
"""
import traceback
from backend.pso.optimizer import PSOOptimizer
from backend.sa.optimizer import SAOptimizer
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from backend.api.schemas import OptimizeConfig
import json
import io

from backend.api.schemas import (
    SimulationConfig,
    OptimizeConfig,
    ComparisonConfig,
    ExportRequest,
)
from backend.simulation.simulator import TrafficSimulator
from backend.baselines.fixed_timing import run_fixed_timing, run_fixed_timing_with_snapshots
from backend.baselines.random_timing import run_random_timing, run_random_timing_with_snapshots
from backend.ga.optimizer import GAOptimizer
from backend.utils.export import export_to_json, export_to_csv, generate_verdict

router = APIRouter(prefix="/api")


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "MetaTraffic AI"}


@router.get("/config")
async def get_default_config():
    """Get default configuration parameters."""
    return {
        "simulation": SimulationConfig().model_dump(),
        "ga": OptimizeConfig().model_dump(),
        "comparison": ComparisonConfig().model_dump(),
    }


@router.post("/simulate")
async def run_simulation(config: SimulationConfig):
    """
    Run a traffic simulation with fixed timing.

    Returns simulation results including throughput, waiting time,
    queue length, and gridlock metrics.
    """
    try:
        if config.with_snapshots:
            results = run_fixed_timing_with_snapshots(
                grid_size=config.grid_size,
                green_duration=config.green_duration,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate,
                snapshot_interval=config.snapshot_interval,
            )
        else:
            results = run_fixed_timing(
                grid_size=config.grid_size,
                green_duration=config.green_duration,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate,
            )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/simulate/random")
async def run_random_simulation(config: SimulationConfig):
    """Run a traffic simulation with random timing."""
    try:
        if config.with_snapshots:
            results = run_random_timing_with_snapshots(
                grid_size=config.grid_size,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate,
                snapshot_interval=config.snapshot_interval,
            )
        else:
            results = run_random_timing(
                grid_size=config.grid_size,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate,
            )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/optimize")
async def run_optimization(config: OptimizeConfig):
    try:
        if config.algorithm == "PSO":
            optimizer = PSOOptimizer(
                grid_size=config.grid_size,
                swarm_size=config.swarm_size,
                iterations=config.pso_iterations,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate
            )
        elif config.algorithm == "SA":
            optimizer = SAOptimizer(
                grid_size=config.grid_size,
                initial_temp=config.sa_initial_temp,
                iterations=config.sa_iterations,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate
            )
        else:  # Default to GA
            optimizer = GAOptimizer(
                grid_size=config.grid_size,
                population_size=config.population_size,
                generations=config.generations,
                crossover_rate=config.crossover_rate,
                mutation_rate=config.mutation_rate,
                elite_count=config.elite_count,
                tournament_size=config.tournament_size,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate,
            )

        results = optimizer.run()

# 🚨 NEW: Capture Snapshots for Simulator UI Visualization
        if getattr(config, 'with_snapshots', False):
            best_timing = results["best_chromosome"]["timing_plan"]
            sim = TrafficSimulator(
                grid_size=config.grid_size,
                timing_plan=best_timing,
                sim_steps=config.sim_steps,
                spawn_rate=config.spawn_rate
            )
            # Record the grid state every X steps AND get complete metrics
            snap_results = sim.run_with_snapshots(
                snapshot_interval=getattr(config, 'snapshot_interval', 5))

            # 🚨 FIX: GA was missing metrics. This overwrites the old metrics
            # with the newly generated, 100% complete metrics from the final run.
            full_metrics = {k: v for k,
                            v in snap_results.items() if k != "snapshots"}
            results["best_chromosome"]["metrics"] = full_metrics
            results["best_chromosome"]["snapshots"] = snap_results["snapshots"]

        return results
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/compare")
async def run_comparison(config: ComparisonConfig):
    try:
        # 🚨 FIX: Prevent Browser Timeouts by capping max iterations during "Compare All"
        # This reduces the total simulations from ~3000 to ~250 for quick frontend response.
        safe_ga_pop = min(config.ga_population_size, 10)
        safe_ga_gen = min(config.ga_generations, 10)
        safe_pso_swarm = min(config.pso_swarm_size, 10)
        safe_pso_iter = min(config.pso_iterations, 10)
        # SA checks 1 neighbor per iter, so 100 is fast
        safe_sa_iter = min(config.sa_iterations, 100)

        # 1. Fixed timing baseline
        fixed_results = run_fixed_timing(
            grid_size=config.grid_size,
            green_duration=config.fixed_green_duration,
            sim_steps=config.sim_steps,
            spawn_rate=config.spawn_rate,
        )

        # 2. GA Optimized timing
        ga_opt = GAOptimizer(
            grid_size=config.grid_size,
            population_size=safe_ga_pop,
            generations=safe_ga_gen,
            crossover_rate=config.ga_crossover_rate,
            mutation_rate=config.ga_mutation_rate,
            sim_steps=config.sim_steps,
            spawn_rate=config.spawn_rate,
        )
        ga_results = ga_opt.run()
        ga_best = ga_results["best_chromosome"]["metrics"]
        ga_best["strategy"] = "GA Optimized"

        # 3. PSO Optimized timing
        pso_opt = PSOOptimizer(
            grid_size=config.grid_size,
            swarm_size=safe_pso_swarm,
            iterations=safe_pso_iter,
            sim_steps=config.sim_steps,
            spawn_rate=config.spawn_rate
        )
        pso_results = pso_opt.run()
        pso_best = pso_results["best_chromosome"]["metrics"]
        pso_best["strategy"] = "PSO Optimized"

        # 4. SA Optimized timing
        sa_opt = SAOptimizer(
            grid_size=config.grid_size,
            initial_temp=config.sa_initial_temp,
            iterations=safe_sa_iter,
            sim_steps=config.sim_steps,
            spawn_rate=config.spawn_rate
        )
        sa_results = sa_opt.run()
        sa_best = sa_results["best_chromosome"]["metrics"]
        sa_best["strategy"] = "SA Optimized"

        verdict = "Comparison complete. Check the metrics above to see which algorithm performed best."

        return {
            "fixed": fixed_results,
            "ga_optimized": ga_best,
            "pso_optimized": pso_best,
            "sa_optimized": sa_best,
            "verdict": verdict,
            "ga_history": ga_results["history"],
            "pso_history": pso_results["history"],
            "sa_history": sa_results["history"],
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/export")
async def export_results(request: ExportRequest):
    """Export results in JSON or CSV format."""
    try:
        if request.format == "csv":
            csv_content = export_to_csv(request.data)
            return StreamingResponse(
                io.BytesIO(csv_content.encode()),
                media_type="text/csv",
                headers={
                    "Content-Disposition": "attachment; filename=results.csv"},
            )
        else:
            json_content = export_to_json(request.data)
            return StreamingResponse(
                io.BytesIO(json_content.encode()),
                media_type="application/json",
                headers={
                    "Content-Disposition": "attachment; filename=results.json"},
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
