import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export function NewVsReturningUsersChart({
  loading,
  chartData,
}: {
  loading: boolean;
  chartData: { name: string, value: number }[];
}) {
  if (loading) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        Loading user data...
      </div>
    );
  }

  if (
    chartData.length === 0 ||
    chartData.every((item: any) => item.value === 0)
  ) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        No user data available
      </div>
    );
  }

  const COLORS = ["#3b82f6", "#10b981"];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {chartData.map((entry: any, index: number) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderColor: "#1e40af",
              borderRadius: "0.375rem",
              color: "#fff",
            }}
            itemStyle={{
              color: "#ffffff", // white text
            }}
            labelStyle={{
              color: "#ffffff", // white label
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
