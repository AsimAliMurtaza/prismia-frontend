"use client"

import { useState } from "react"
import { HRAgentSidebar } from "./hr-agent-sidebar"
import { HRAgentStats } from "./hr-agent-stats"
import { ResumeScreening } from "./resume-screening"
import { CandidateManagement } from "./candidate-management"
import { InterviewScheduler } from "./interview-scheduler"
import { EmployeeOnboarding } from "./employee-onboarding"
import { PerformanceAnalytics } from "./performance-analytics"
import { HRChatInterface } from "./hr-chat-interface"

export type HRView = "overview" | "resume" | "candidates" | "interviews" | "onboarding" | "analytics" | "chat"

export function HRAgentDashboard() {
  const [activeView, setActiveView] = useState<HRView>("overview")

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <HRAgentStats />
      case "resume":
        return <ResumeScreening />
      case "candidates":
        return <CandidateManagement />
      case "interviews":
        return <InterviewScheduler />
      case "onboarding":
        return <EmployeeOnboarding />
      case "analytics":
        return <PerformanceAnalytics />
      case "chat":
        return <HRChatInterface />
      default:
        return <HRAgentStats />
    }
  }

  return (
    <div className="flex h-full">
      <HRAgentSidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 p-6 overflow-auto">{renderContent()}</div>
    </div>
  )
}
