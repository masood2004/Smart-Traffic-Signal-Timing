"""
Export utilities for saving simulation and optimization results.
"""

import json
import csv
import io
from typing import Dict, Any, Optional


def export_to_json(data: Dict[str, Any]) -> str:
    """Export data as formatted JSON string."""
    return json.dumps(data, indent=2, default=str)


def export_to_csv(data: Dict[str, Any]) -> str:
    """
    Export comparison data as CSV string.
    Handles flat metric dictionaries.
    """
    output = io.StringIO()

    # If data has strategy results
    strategies = []
    for key in ["fixed", "random", "ga_optimized", "pso_optimized", "sa_optimized"]:
        if key in data:
            strategy_data = data[key]
            strategies.append(strategy_data)

    if strategies:
        # Get all metric keys
        metric_keys = set()
        for s in strategies:
            metric_keys.update(s.keys())

        # Remove non-metric keys
        skip_keys = {"timing_plan", "snapshots", "description"}
        metric_keys = sorted(metric_keys - skip_keys)

        writer = csv.writer(output)
        writer.writerow(["Metric"] + [s.get("strategy", "Unknown")
                        for s in strategies])

        for key in metric_keys:
            row = [key] + [str(s.get(key, "N/A")) for s in strategies]
            writer.writerow(row)
    else:
        # Generic dict export
        writer = csv.writer(output)
        for key, value in data.items():
            if not isinstance(value, (dict, list)):
                writer.writerow([key, value])

    return output.getvalue()


def generate_verdict(
    fixed: Dict,
    random: Optional[Dict],
    ga: Optional[Dict],
    pso: Optional[Dict] = None,
    sa: Optional[Dict] = None,
) -> str:
    """
    Generate a dynamic verdict comparing baseline and optimizer strategies.

    Analyzes throughput, waiting time, and gridlock metrics to produce
    a natural language summary of which approach performed best.
    """
    strategies = {
        "Fixed Timing": fixed,
    }
    if random:
        strategies["Random Timing"] = random
    if ga:
        strategies["GA Optimized"] = ga
    if pso:
        strategies["PSO Optimized"] = pso
    if sa:
        strategies["SA Optimized"] = sa

    verdicts = []

    throughputs = {k: v.get("throughput", 0) for k, v in strategies.items()}
    wait_times = {k: v.get("avg_waiting_time", 999)
                  for k, v in strategies.items()}
    gridlocks = {k: v.get("gridlock_penalty", 999)
                 for k, v in strategies.items()}

    best_throughput = max(throughputs, key=throughputs.get)
    best_wait = min(wait_times, key=wait_times.get)
    best_gridlock = min(gridlocks, key=gridlocks.get)

    verdicts.append(
        f"Highest throughput: {best_throughput} ({throughputs[best_throughput]} vehicles)."
    )
    verdicts.append(
        f"Lowest average waiting time: {best_wait} ({wait_times[best_wait]:.1f}s)."
    )
    verdicts.append(
        f"Lowest gridlock penalty: {best_gridlock} ({gridlocks[best_gridlock]:.2f})."
    )

    wins = {name: 0 for name in strategies}
    for winner in [best_throughput, best_wait, best_gridlock]:
        wins[winner] += 1

    best_overall = max(wins, key=wins.get)
    if wins[best_overall] >= 2:
        verdicts.append(
            f"CONCLUSION: {best_overall} performed best across multiple metrics in this run."
        )
    else:
        verdicts.append(
            "CONCLUSION: No single strategy dominated across metrics. Review the charts for trade-offs."
        )

    return " ".join(verdicts)
