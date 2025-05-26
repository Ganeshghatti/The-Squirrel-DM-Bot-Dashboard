import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';
import { ResponsiveHeatMap } from '@nivo/heatmap';

interface HeatmapChartProps {
  timeRange: string;
  refreshKey: number;
  dataKey: 'userHeatmap' | 'messageHeatmap';
  title: string;
}

export function HeatmapChart({ timeRange, refreshKey, dataKey, title }: HeatmapChartProps) {
  const token = useAuthStore((state) => state.token);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [maxCount, setMaxCount] = useState(1);

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
        if (data.success && data.analytics?.[dataKey]) {
          setChartData(data.analytics[dataKey]);
          const max = Math.max(
            ...data.analytics[dataKey].flatMap((series: any) =>
              series.data.map((d: any) => d.y || 0)
            ),
            1
          );
          setMaxCount(max);
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
  }, [token, timeRange, refreshKey, dataKey]);

  if (loading) {
    return <div className="h-80 flex items-center justify-center text-slate-400">Loading {title.toLowerCase()}...</div>;
  }

  if (chartData.length === 0) {
    return <div className="h-80 flex items-center justify-center text-slate-400">No {title.toLowerCase()} available</div>;
  }

  // Proper heatmap color scale: cool (blue) to warm (red/orange)
  const colors = (value: number) => {
    if (value === 0) return '#1e293b'; // Dark slate for zero values
    
    const intensity = Math.min(value / maxCount, 1);
    
    if (intensity <= 0.2) {
      // Very low: dark blue to blue
      const t = intensity / 0.2;
      const r = Math.round(30 + (59 - 30) * t);
      const g = Math.round(58 + (130 - 58) * t);
      const b = Math.round(138 + (246 - 138) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (intensity <= 0.4) {
      // Low: blue to cyan
      const t = (intensity - 0.2) / 0.2;
      const r = Math.round(59 + (34 - 59) * t);
      const g = Math.round(130 + (197 - 130) * t);
      const b = Math.round(246 + (94 - 246) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (intensity <= 0.6) {
      // Medium: cyan to green
      const t = (intensity - 0.4) / 0.2;
      const r = Math.round(34 + (74 - 34) * t);
      const g = Math.round(197 + (222 - 197) * t);
      const b = Math.round(94 + (128 - 94) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (intensity <= 0.8) {
      // High: green to yellow
      const t = (intensity - 0.6) / 0.2;
      const r = Math.round(74 + (255 - 74) * t);
      const g = Math.round(222 + (255 - 222) * t);
      const b = Math.round(128 + (0 - 128) * t);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Very high: yellow to red
      const t = (intensity - 0.8) / 0.2;
      const r = Math.round(255 + (220 - 255) * t);
      const g = Math.round(255 + (38 - 255) * t);
      const b = Math.round(0 + (127 - 0) * t);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-80"
    >
      <ResponsiveHeatMap
        data={chartData}
        margin={{ top: 20, right: 30, bottom: 40, left: 60 }}
        valueFormat=">-.0f"
        colors={colors}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Hour of Day',
          legendOffset: -36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: timeRange === '24h' ? 'Day' : timeRange === '7d' ? 'Day' : 'Week',
          legendPosition: 'middle',
          legendOffset: -50,
        }}
        axisBottom={null}
        axisRight={null}
        cellOpacity={1}
        cellBorderColor="#374151"
        labelTextColor="#f9fafb"
        hoverTarget="cell"
        cellHoverOthersOpacity={0.5}
        tooltip={({ cell }) => (
          <div
            style={{
              background: '#111827',
              border: '1px solid #1e40af',
              borderRadius: '0.375rem',
              padding: '16px',
              color: '#f9fafb',
            }}
          >
            <strong>{cell.serieId}, {cell.data.x}:00</strong>: {cell.data.y} {dataKey === 'userHeatmap' ? 'users' : 'messages'}
          </div>
        )}
      />
    </motion.div>
  );
}