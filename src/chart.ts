import van from "vanjs-core";
import LibChart from "chart.js/auto";
import type { ChartConfiguration } from "chart.js/auto";

const { div, canvas } = van.tags;

export const Chart = (config: ChartConfiguration) => {
  const chart = new LibChart(canvas({ id: "simChart" }), config);

  return div(
    chart.canvas,
  );
}