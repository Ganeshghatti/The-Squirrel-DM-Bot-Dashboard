import React from 'react'
import { KpiCards } from './kpi-cards'
import { BotStatus } from './bot-status'
import { ConversationChart } from './conversation-chart'
import { MessageVolumeTrendChart } from './MessageVolumeTrendChart'
import ResponseRateChart from './response-rate-chart'
import { DailyActiveUsersChart } from './daily-active-users'
import { NewVsReturningUsersChart } from './new-vs-returning-user-charts'
import { ActivityLog } from './activity-log'

const DashboardContent = ({ timeRange, refreshKey, handleKpiClick, selectedKpi }: { timeRange: string, refreshKey: number, handleKpiClick: (kpi: "Users" | "Messages" | null) => void, selectedKpi: "Users" | "Messages" | null }) => {
    return (
        <div className="mt-6 space-y-6">
            <section className="animate-fade-in">
                <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                    Performance Overview
                </h2>
                <KpiCards
                    timeRange={timeRange}
                    refreshKey={refreshKey}
                    onKpiClick={handleKpiClick}
                    selectedKpi={selectedKpi}
                />
            </section>

            {/* Conditionally render charts based on selected KPI */}
            {(selectedKpi === null || selectedKpi === "Messages") && (
                <>
                    <section className="animate-fade-in animation-delay-100">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <h2 className="text-xl font-display font-medium text-white tracking-tight">
                                Conversation Activity
                            </h2>
                            <BotStatus />
                        </div>
                        <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                            <ConversationChart timeRange={timeRange} refreshKey={refreshKey} />
                        </div>
                    </section>

                    <section className="animate-fade-in animation-delay-400">
                        <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                            Message Volume Trend
                        </h2>
                        <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                            <MessageVolumeTrendChart timeRange={timeRange} refreshKey={refreshKey} />
                        </div>
                    </section>

                    <section className="animate-fade-in animation-delay-400">
                        <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                            Response Rate Chart
                        </h2>
                        <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                            <ResponseRateChart timeRange={timeRange} refreshKey={refreshKey} />
                        </div>
                    </section>
                </>
            )}

            {(selectedKpi === null || selectedKpi === "Users") && (
                <>
                    <section className="animate-fade-in animation-delay-150">
                        <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                            Daily Active Users
                        </h2>
                        <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                            <DailyActiveUsersChart timeRange={timeRange} refreshKey={refreshKey} />
                        </div>
                    </section>

                    <section className="animate-fade-in animation-delay-300">
                        <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                            New vs Returning Users
                        </h2>
                        <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                            <NewVsReturningUsersChart timeRange={timeRange} refreshKey={refreshKey} />
                        </div>
                    </section>
                </>
            )}

            <section className="animate-fade-in animation-delay-450">
                <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                    Recent Activity
                </h2>
                <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                    <ActivityLog timeRange={timeRange} refreshKey={refreshKey} />
                </div>
            </section>
        </div>
    )
}

export default DashboardContent