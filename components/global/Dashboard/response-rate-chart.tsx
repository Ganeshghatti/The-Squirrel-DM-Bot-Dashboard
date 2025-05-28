
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function ResponseRateChart({ loading, chartData }: {
    loading: boolean,
    chartData: []
}) {


    if (loading) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-400">
                Loading response rate data...
            </div>
        );
    }


    if (chartData.length === 0) {
        return (
            <div className="h-80 flex items-center justify-center text-gray-400">
                No response rate data available
            </div>
        );
    }

    return (
        <div className="h-80 w-full">
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
                        label={{ value: 'Hour', position: 'bottom', offset: 0, fill: '#9ca3af' }}
                    />
                    <YAxis
                        dataKey="responseRate"
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                        allowDecimals={true}
                        label={{ value: 'Response Rate (%)', angle: -90, position: 'insideLeft', fill: '#9ca3af' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#111827',
                            borderColor: '#1e40af',
                            borderRadius: '0.375rem',
                            color: '#f9fafb'
                        }}
                        labelFormatter={(label) => `Hour: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="responseRate"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                        name="Response Rate (%)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}