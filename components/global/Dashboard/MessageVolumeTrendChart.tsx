import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function MessageVolumeTrendChart({
  timeRange,
  loading,
  chartData
}: {
  timeRange: string;
  loading: boolean;
  chartData: { time: string; count: number }[];
}) {
  const formatXAxis = (tick: string) => {
    if (timeRange === '24h') {
      return tick; // HH:MM
    } else if (timeRange === '7d') {
      return tick; // e.g. "Mon"
    } else if (timeRange === '30d') {
      return tick; // e.g. "Week 1"
    }
    return tick;
  };

  const xAxisLabel =
    timeRange === '24h' ? 'Hour' : timeRange === '7d' ? 'Day' : 'Week';

  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        Loading message volume data...
      </div>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        No message volume data available
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
            label={{
              value: xAxisLabel,
              position: 'bottom',
              offset: 0,
              fill: '#9ca3af'
            }}
            tickFormatter={formatXAxis}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
            allowDecimals={false}
            label={{
              value: 'Message Count',
              angle: -90,
              position: 'insideLeft',
              fill: '#9ca3af'
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#111827',
              borderColor: '#1e40af',
              borderRadius: '0.375rem',
              color: '#f9fafb'
            }}
            labelFormatter={(label) => `${xAxisLabel}: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Message Count"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
