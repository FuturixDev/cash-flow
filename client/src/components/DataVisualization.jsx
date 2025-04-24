import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DataVisualization = ({ data }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e6f1ff',
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#8892b0',
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#8892b0',
        }
      }
    }
  };

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: '收入',
        data: data?.income || [],
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.1)',
      },
      {
        label: '支出',
        data: data?.expenses || [],
        borderColor: '#ff416c',
        backgroundColor: 'rgba(255, 65, 108, 0.1)',
      }
    ]
  };

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 rounded-lg bg-slate-900/50">
          <div className="text-slate-400">總收入</div>
          <div className="text-xl text-cyan-400">
            ${data?.totalIncome?.toLocaleString() || '0'}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50">
          <div className="text-slate-400">總支出</div>
          <div className="text-xl text-red-400">
            ${data?.totalExpenses?.toLocaleString() || '0'}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-slate-900/50">
          <div className="text-slate-400">淨收入</div>
          <div className="text-xl text-emerald-400">
            ${(data?.totalIncome - data?.totalExpenses)?.toLocaleString() || '0'}
          </div>
        </div>
      </div>
      <div style={{ height: '300px' }}>
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default DataVisualization; 