import React, { useEffect, useRef } from 'react';

interface HealthMetric {
  id: string;
  type: string;
  value: string;
  unit: string;
  date: string;
  status: 'normal' | 'warning' | 'critical';
}

interface HealthMetricsChartProps {
  metrics: HealthMetric[];
  type: string;
}

export default function HealthMetricsChart({ metrics, type }: HealthMetricsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || metrics.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Filter metrics by type
    const filteredMetrics = metrics.filter(m => m.type === type).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (filteredMetrics.length === 0) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Parse values
    const values = filteredMetrics.map(m => parseFloat(m.value.split('/')[0])); // Handle blood pressure
    const maxValue = Math.max(...values) * 1.1;
    const minValue = Math.min(...values) * 0.9;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i * (width - 2 * padding)) / 5;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = padding + (i * (height - 2 * padding)) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw line chart
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    filteredMetrics.forEach((metric, index) => {
      const value = parseFloat(metric.value.split('/')[0]);
      const x = padding + (index * (width - 2 * padding)) / (filteredMetrics.length - 1);
      const y = height - padding - ((value - minValue) * (height - 2 * padding)) / (maxValue - minValue);

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      // Draw data points
      ctx.fillStyle = getStatusColor(metric.status);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.stroke();

    // Draw axes labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';

    // X-axis labels (dates)
    filteredMetrics.forEach((metric, index) => {
      if (index % Math.ceil(filteredMetrics.length / 5) === 0) {
        const x = padding + (index * (width - 2 * padding)) / (filteredMetrics.length - 1);
        const date = new Date(metric.date).toLocaleDateString([], { month: 'short', day: 'numeric' });
        ctx.fillText(date, x, height - 10);
      }
    });

    // Y-axis labels (values)
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const value = minValue + (i * (maxValue - minValue)) / 4;
      const y = height - padding - (i * (height - 2 * padding)) / 4;
      ctx.fillText(value.toFixed(1), padding - 10, y + 4);
    }

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#111827';
    ctx.font = '16px Arial';
    ctx.fillText(`${type} Trend`, width / 2, 20);

  }, [metrics, type]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full h-auto"
      />
      {metrics.filter(m => m.type === type).length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>No data available for {type}</p>
          </div>
        </div>
      )}
    </div>
  );
}
