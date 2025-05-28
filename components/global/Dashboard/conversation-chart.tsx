import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function ConversationChart({ timeRange, refreshKey, loading, chartData }: { timeRange: string, refreshKey: number, loading: boolean, chartData: any }) {


  if (loading) {
    return <div className="h-80 flex items-center justify-center text-slate-400">Loading conversation data...</div>;
  }

  if (chartData?.length === 0) {
    return <div className="h-80 flex items-center justify-center text-slate-400">No conversation data available</div>;
  }

  // Custom tick formatter for X-axis based on timeRange
  const formatXAxis = (tick: string) => {
    if (timeRange === "24h") {
      return tick; // Already formatted as HH:MM
    } else if (timeRange === "7d") {
      return tick; // Already formatted as short day names
    } else if (timeRange === "30d") {
      return tick; // Already formatted as Week X
    }
    return tick;
  };

  // Dynamic X-axis label based on timeRange
  const xAxisLabel = timeRange === "24h" ? "Hour" : timeRange === "7d" ? "Day" : "Week";

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
            label={{ value: xAxisLabel, position: 'bottom', offset: 0, fill: '#9ca3af' }}
            tickFormatter={formatXAxis}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
            allowDecimals={false}
            label={{ value: 'Message Count', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
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
            stroke="#3b82f6"
            strokeWidth={2}
            activeDot={{ r: 8 }}
            name="Message Count"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}