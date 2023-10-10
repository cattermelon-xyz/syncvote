import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type HistogramChartProps = {
  data: number[];
};

function HistogramChart({ data }: HistogramChartProps): JSX.Element {
  const binEdges = [1, 2, 3, 4, 5, 6, 7, 8];

  const labels = binEdges.map((edge, index) => {
    if (index === 0) return `0-${edge}`;
    return `${binEdges[index - 1]}-${edge}`;
  });
  labels.push(`${binEdges[binEdges.length - 1]}+`);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Number of workspaces",
        data: data,
        backgroundColor: ["#391572"],
        borderColor: ["#964DFF"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          padding: 16, // Adjust this value to your preference
        },
      },
      y: {
        ticks: {
          padding: 16, // Adjust this value to your preference
        },
      },
    },

    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 30,
          padding: 40,
          pointStyle: "circle",
        },
      },
    },
  };

  return (
    <>
      <Bar data={chartData} options={options} height={250} />
    </>
  );
}

export default HistogramChart;
