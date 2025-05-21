import { Sidebar } from "./components/sidebar";
import { DashboardHeader } from "./components/dashboard-header";
import { KpiCards } from "./components/kpi-cards";
import { ConversationChart } from "./components/conversation-chart";
import { ActivityLog } from "./components/activity-log";
import { BotStatus } from "./components/bot-status";
import { MobileNav } from "./components/mobile-nav";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-zinc-950 text-slate-100 flex">
      {/* Sidebar - hidden on mobile */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col md:p-10 md:pl-48">
        <MobileNav />
        <main className="flex-1 px-4 py-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <DashboardHeader />

          <div className="mt-6 space-y-6">
            {/* KPI Section */}
            <section className="animate-fade-in">
              <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                Performance Overview
              </h2>
              <KpiCards />
            </section>

            {/* Conversation Activity Graph */}
            <section className="animate-fade-in animation-delay-100">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-display font-medium text-white tracking-tight">
                  Conversation Activity
                </h2>
                <BotStatus />
              </div>
              <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                <ConversationChart />
              </div>
            </section>

            {/* Recent Activity Log */}
            <section className="animate-fade-in animation-delay-200">
              <h2 className="text-xl font-display font-medium text-white mb-4 tracking-tight">
                Recent Activity
              </h2>
              <div className="bg-zinc-900/60 border border-blue-900/30 rounded-xl p-5 backdrop-blur-sm">
                <ActivityLog />
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
