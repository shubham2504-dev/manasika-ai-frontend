import React from 'react';
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
import { Line } from 'react-chartjs-2';
import { useMood } from '../../contexts/MoodContext';
import { getMoodChartData } from '../../utils/moodUtils';

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

const MoodChart: React.FC = () => {
  const { state } = useMood();
  const chartData = getMoodChartData(state.entries, 7);

  const data = {
    labels: chartData.map(point => point.label),
    datasets: [
      {
        label: 'Mood Level',
        data: chartData.map(point => point.value || null),
        borderColor: 'rgba(74, 144, 226, 1)',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(74, 144, 226, 1)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        spanGaps: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(74, 144, 226, 1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            const labels = ['', 'Very Low 😢', 'Low 😕', 'Neutral 😐', 'Good 🙂', 'Very High 😊'];
            return labels[value] || 'No entry';
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function(value: any) {
            const emojis = ['', '😢', '😕', '😐', '🙂', '😊'];
            return emojis[value] || '';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        border: {
          display: false
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: 'rgba(74, 144, 226, 1)'
      }
    }
  };

  return (
    <div className="mood-chart-container">
      {chartData.every(point => point.value === 0) ? (
        <div className="chart-empty-state">
          <p>📈 Start tracking your mood to see your progress!</p>
          <p>Your chart will appear here once you log some entries.</p>
        </div>
      ) : (
        <div className="chart-wrapper">
          <Line data={data} options={options} height={300} />
        </div>
      )}
    </div>
  );
};

export default MoodChart;
