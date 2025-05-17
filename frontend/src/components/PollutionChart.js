import React, { useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  RadarController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  RadialLinearScale,
  LineController
} from 'chart.js';

import { Bar, Line, Radar } from 'react-chartjs-2';
import '../styles/PollutionChart.css';

// Register chart components
ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  RadarController,
  LineController,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  Tooltip,
  Legend
);

const PollutionChart = ({ data }) => {
  const [chartType, setChartType] = useState('bar');

  if (!data) return <div className="chart-loading">Loading pollution data...</div>;

  const labels = ['PM2.5', 'PM10', 'CO', 'NO₂', 'SO₂', 'O₃', 'NH₃'];
  const values = [data.pm25, data.pm10, data.co, data.no2, data.so2, data.o3, data.nh3];

  const chartData = {
    labels,
    datasets: [{
      label: 'Pollutant Concentration',
      data: values,
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(199, 199, 199, 0.7)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)'
      ],
      borderWidth: 1,
      fill: true,
      tension: 0.4
    }]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.parsed.y !== null) {
              label += context.parsed.y + ' µg/m³';
            }
            return label;
          }
        }
      }
    },
    scales: chartType !== 'radar' ? {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Concentration (µg/m³)'
        }
      }
    } : {}
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'radar':
        return <Radar data={chartData} options={options} />;
      case 'bar':
      default:
        return <Bar data={chartData} options={options} />;
    }
  };

  return (
    <div className="pollution-chart">
      <div className="chart-header">
        <h3>Pollution Levels</h3>
        <select onChange={e => setChartType(e.target.value)} value={chartType}>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="radar">Radar</option>
        </select>
      </div>
      <div className="chart-container">
        {renderChart()}
      </div>
    </div>
  );
};

export default PollutionChart;
