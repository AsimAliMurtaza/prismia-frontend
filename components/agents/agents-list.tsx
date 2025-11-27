"use client"

import { AgentCard } from "./agent-card"

const agents = [
  {
    id: "1",
    name: "HR Assistant",
    description: "Handles employee queries, onboarding tasks, and HR document processing.",
    status: "running" as const,
    type: "Human Resources",
    tasksCompleted: 156,
    tasksTotal: 200,
    uptime: "5d 12h",
    memory: 256,
  },
  {
    id: "2",
    name: "Support Agent",
    description: "Customer support triage, ticket routing, and FAQ responses.",
    status: "running" as const,
    type: "Customer Support",
    tasksCompleted: 892,
    tasksTotal: 1000,
    uptime: "12d 8h",
    memory: 384,
  },
  {
    id: "3",
    name: "PM Coordinator",
    description: "Project tracking, status reporting, and team coordination.",
    status: "idle" as const,
    type: "Project Management",
    tasksCompleted: 45,
    tasksTotal: 50,
    uptime: "2d 4h",
    memory: 128,
  },
  {
    id: "4",
    name: "Email Processor",
    description: "Automated email classification, response drafting, and routing.",
    status: "running" as const,
    type: "Custom",
    tasksCompleted: 234,
    tasksTotal: 300,
    uptime: "8d 16h",
    memory: 192,
  },
  {
    id: "5",
    name: "Document Analyzer",
    description: "Extract insights and summaries from uploaded documents.",
    status: "error" as const,
    type: "Custom",
    tasksCompleted: 12,
    tasksTotal: 100,
    uptime: "0d 2h",
    memory: 512,
  },
  {
    id: "6",
    name: "Interview Scheduler",
    description: "Coordinate interview scheduling and candidate communication.",
    status: "stopped" as const,
    type: "Human Resources",
    tasksCompleted: 0,
    tasksTotal: 50,
    uptime: "0d 0h",
    memory: 0,
  },
]

export function AgentsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <AgentCard key={agent.id} {...agent} />
      ))}
    </div>
  )
}
