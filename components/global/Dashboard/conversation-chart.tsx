import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function ConversationChart({ timeRange,refreshKey }: { timeRange: string,refreshKey:number }) {
  const token = useAuthStore((state) => state.token);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setChartData([]);
    setLoading(true);

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics?timeRange=${timeRange}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Analytics API error:", res.status);
          return;
        }

        const data = await res.json();
        if (data.success && data.analytics?.activityData) {
          setChartData(data.analytics.activityData);
        }
      } catch (err) {
        console.error("Network error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalytics();
    }
  }, [token, timeRange,refreshKey]);

  if (loading) {
    return <div className="h-80 flex items-center justify-center text-slate-400">Loading conversation data...</div>;
  }

  if (chartData.length === 0) {
    return <div className="h-80 flex items-center justify-center text-slate-400">No conversation data available</div>;
  }

  // Custom tick formatter for X-axis based on timeRange
  const formatXAxis = (tick: string) => {
    if (timeRange === "24h") {
      // For 24h, show hours (e.g., 14:00)
      return tick; // Already formatted as HH:MM
    } else if (timeRange === "7d") {
      // For 7d, show day names (e.g., Mon, Tue)
      return tick; // Already formatted as short day names
    } else if (timeRange === "30d") {
      // For 30d, show week labels (e.g., Week 1)
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