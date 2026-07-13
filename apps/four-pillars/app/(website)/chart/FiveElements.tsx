"use client";

import { FourPillarsData } from "@/app/types";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  TooltipItem
} from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import { ChartPieIcon } from "@heroicons/react/24/outline";
import type { ChartOptions } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FiveElements({ result, isDarkMode = false }: { result: FourPillarsData, isDarkMode: boolean }) {
  const { elementComposition } = result;
  const data = {
    labels: ["木", "火", "土", "金", "水"],
    datasets: [
      {
        label: "",
        data: elementComposition,
        backgroundColor: [
          "rgb(167 243 208)",
          "rgb(254 202 202)",
          "rgb(254 243 199)",
          "rgb(226 232 240)",
          "rgb(199 210 254)"
        ],
        borderColor: [
          "rgb(167 243 208)",
          "rgb(254 202 202)",
          "rgb(254 243 199)",
          "rgb(226 232 240)",
          "rgb(199 210 254)"
        ],
        borderWidth: 0,
        tooltip: {
          callbacks: {
            label: function (context: TooltipItem<'pie'>) {
              const value = Number(context.formattedValue);
              const sum = elementComposition.reduce((a, b) => {
                return a + b;
              }, 0);
              return ((value / sum) * 100).toFixed(0) + "%";
            }
          }
        }
      }
    ]
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 12,
          font: {
            size: 14,
          },
          color: isDarkMode ? "rgb(209 213 219)" : "rgb(75 85 99)" // text-gray-300 text-gray-600
        },
        onClick: () => { }
      },
      tooltip: {
        titleFont: { size: 16 },
        bodyFont: { size: 16 },
        titleMarginBottom: 10
      }
    }
  };

  return (
    <div className="section-container">
      <div className="section-header flex items-center border-b dark:border-b-0">
        <ChartPieIcon className="section-icon" />
        五行構成
      </div>
      <div className="flex w-full content-center justify-center overflow-hidden p-4 bg-white dark:bg-gray-800 rounded-b-lg">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
