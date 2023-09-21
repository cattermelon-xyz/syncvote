import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  Filler,
  Legend
);

type LineChartProps = {
  workspaces: number[];
  workflows: number[];
  selectedFilter: string;
};

function LineChart({
  workspaces,
  workflows,
  selectedFilter,
}: LineChartProps): JSX.Element {
  const getSelectedIndexes = (numberOfDays: number) => {
    const step = Math.floor(numberOfDays / 4);
    return [numberOfDays - step, numberOfDays - step * 2, numberOfDays - step * 3, 0];
  };
  
  const getDateLabels = (numberOfDays: number) => {
    const indexes = getSelectedIndexes(numberOfDays);
    const labels = [];
    for (const index of indexes) {
      const date = new Date();
      date.setDate(date.getDate() - index);
  
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      labels.push(formattedDate);
    }
    return labels;
  };

  let numberOfDays;
  switch (selectedFilter) {
    case "7 days":
      numberOfDays = 7;
      break;
    case "30 days":
      numberOfDays = 30;
      break;
    case "90 days":
      numberOfDays = 90;
      break;
    case "All":
      numberOfDays = 365;
      break;
    default:
      numberOfDays = 7;
  }


  const indexes = getSelectedIndexes(numberOfDays);
  const data = {
    labels: getDateLabels(numberOfDays),
    datasets: [
      {
        label: "Workspaces",
        data: indexes.map((index) => workspaces[index]),
        borderColor: "#F6BB49",
        backgroundColor: ["#5A3E13"],
        borderWidth: 2,
        fill: true,
      },
      {
        label: "Workflows",
        data: indexes.map((index) => workflows[index]),
        borderColor: "#964DFF",
        backgroundColor: ["#391572"],
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          padding: 16,
        },
      },
      y: {
        ticks: {
          padding: 16,
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
      <Line data={data} options={options} height={250} />
    </>
  );
}

export default LineChart;
