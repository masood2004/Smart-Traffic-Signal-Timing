import React from "react";
import "./ComparisonTable.css";

export default function ComparisonTable({ fixed, ga, pso, sa }) {
  if (!fixed || !ga || !pso || !sa) return null;

  return (
    <div className="table-wrapper">
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Fixed Baseline</th>
            <th>GA Optimized</th>
            <th>PSO Optimized</th>
            <th>SA Optimized</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Throughput (Vehicles completed)</td>
            <td>{fixed.throughput}</td>
            <td
              className={
                ga.throughput >= pso.throughput &&
                ga.throughput >= sa.throughput
                  ? "highlight-good"
                  : ""
              }
            >
              {ga.throughput}
            </td>
            <td
              className={
                pso.throughput >= ga.throughput &&
                pso.throughput >= sa.throughput
                  ? "highlight-good"
                  : ""
              }
            >
              {pso.throughput}
            </td>
            <td
              className={
                sa.throughput >= ga.throughput &&
                sa.throughput >= pso.throughput
                  ? "highlight-good"
                  : ""
              }
            >
              {sa.throughput}
            </td>
          </tr>
          <tr>
            <td>Average Wait Time (Seconds)</td>
            <td>{fixed.avg_waiting_time}</td>
            <td
              className={
                ga.avg_waiting_time <= pso.avg_waiting_time &&
                ga.avg_waiting_time <= sa.avg_waiting_time
                  ? "highlight-good"
                  : ""
              }
            >
              {ga.avg_waiting_time}
            </td>
            <td
              className={
                pso.avg_waiting_time <= ga.avg_waiting_time &&
                pso.avg_waiting_time <= sa.avg_waiting_time
                  ? "highlight-good"
                  : ""
              }
            >
              {pso.avg_waiting_time}
            </td>
            <td
              className={
                sa.avg_waiting_time <= ga.avg_waiting_time &&
                sa.avg_waiting_time <= pso.avg_waiting_time
                  ? "highlight-good"
                  : ""
              }
            >
              {sa.avg_waiting_time}
            </td>
          </tr>
          <tr>
            <td>Max Queue Length</td>
            <td>{fixed.max_queue_length}</td>
            <td>{ga.max_queue_length}</td>
            <td>{pso.max_queue_length}</td>
            <td>{sa.max_queue_length}</td>
          </tr>
          <tr>
            <td>Gridlock Penalty</td>
            <td>{fixed.gridlock_penalty}</td>
            <td>{ga.gridlock_penalty}</td>
            <td>{pso.gridlock_penalty}</td>
            <td>{sa.gridlock_penalty}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
