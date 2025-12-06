import { Header } from "@/components/layout/header"
import { HRAgentDashboard } from "@/components/hr-agent/hr-agent-dashboard"

export default function HRAgentPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="HR Agent" description="Intelligent Human Resources automation and management" />
      <div className="flex-1 overflow-auto">
        <HRAgentDashboard />
      </div>
    </div>
  )
}
