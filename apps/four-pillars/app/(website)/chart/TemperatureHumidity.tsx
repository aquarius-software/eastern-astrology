"use client";

import { FourPillarsData } from "@/app/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  TooltipItem,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { SunIcon } from "@heroicons/react/24/outline";

// https://codesandbox.io/p/devbox/reactchartjs-react-chartjs-2-horizontal-or99p

export default function TemperatureHumidity({ result, isDarkMode = false }: { result: FourPillarsData, isDarkMode: boolean }) {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  ChartJS.defaults.font.size = 14;
  ChartJS.defaults.scales.linear.min = 0;
  ChartJS.defaults.scales.linear.max = 100;

  const { temperature, humidity } = result;
  const temperatureOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '寒暖',
        font: {
          size: 16,
        },
      },
    },
  };

  const humidityOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '燥湿',
        font: {
          size: 16,
        },
      },
    },
  };

  const temperatureLabels = ['寒', '暖',];
  const humidityLabels = ['燥', '湿'];

  const temperatureData = (temperature: number) => {
    const cold = (1.0 - temperature) * 100;
    const heat = temperature * 100;

    return {
      labels: temperatureLabels,
      datasets: [
        {
          data: [cold, heat],
          color: false ? "rgb(209 213 219)" : "rgb(75 85 99)",
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: ['rgba(53, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
          borderWidth: 0,
          tooltip: {
            callbacks: {
              label: function (context: TooltipItem<'bar'>) {
                const temperatureValue = Number(context.raw);
                return `${temperatureValue.toFixed()}%`
              }
            }
          }
        }
      ],
    };
  };

  const humidityData = (humidity: number) => {
    const dryness = (1.0 - humidity) * 100;
    const moistness = humidity * 100;

    return {
      labels: humidityLabels,
      datasets: [
        {
          data: [dryness, moistness],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: ['rgb(178,223,138)', 'rgb(166,206,227)'],
          borderWidth: 0,
          tooltip: {
            callbacks: {
              label: function (context: TooltipItem<'bar'>) {
                const humidityValue = Number(context.raw);
                return `${humidityValue.toFixed()}%`
              }
            }
          }
        }
      ]
    }
  };

  return (
    <div className="section-container">
      <div className="section-header flex items-center border-b dark:border-b-0">
        <SunIcon className="section-icon" />
        寒暖・燥湿
      </div>
      <div className="flex w-full content-center justify-center overflow-hidden p-4 bg-white dark:bg-gray-800 rounded-b-lg">
        <Bar options={temperatureOptions} data={temperatureData(temperature)} />
      </div>
      <div className="flex w-full content-center justify-center overflow-hidden p-4 bg-white dark:bg-gray-800 rounded-b-lg">
        <Bar options={humidityOptions} data={humidityData(humidity)} />
      </div>
    </div>
  );
}