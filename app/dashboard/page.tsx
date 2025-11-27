import { Header } from "@/components/layout/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { PipelineStatusChart } from "@/components/dashboard/pipeline-status-chart"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ActiveAgents } from "@/components/dashboard/active-agents"
import { GitBranch, Bot, Zap, Clock } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" description="Overview of your agentic AI platform" />
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Pipelines"
            value={12}
            icon={GitBranch}
            trend={{ value: 8, positive: true }}
            description="from last week"
          />
          <StatsCard
            title="Running Agents"
            value={24}
            icon={Bot}
            trend={{ value: 12, positive: true }}
            description="from last week"
          />
          <StatsCard
            title="Executions Today"
            value="1,284"
            icon={Zap}
            trend={{ value: 5, positive: true }}
            description="from yesterday"
          />
          <StatsCard
            title="Avg Response Time"
            value="234ms"
            icon={Clock}
            trend={{ value: 3, positive: false }}
            description="from last hour"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart - takes 2 columns */}
          <div className="lg:col-span-2">
            <PipelineStatusChart />
          </div>
          {/* Quick Actions */}
          <QuickActions />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActivityFeed />
          <ActiveAgents />
        </div>
      </div>
    </div>
  )
}
