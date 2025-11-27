"use client"

import { PipelineCard } from "./pipeline-card"

const pipelines = [
  {
    id: "1",
    name: "HR Onboarding Assistant",
    description: "Automated employee onboarding workflow with document processing and task assignment.",
    status: "active" as const,
    category: "Human Resources",
    nodes: 8,
    executions: 1243,
    lastRun: "5 min ago",
  },
  {
    id: "2",
    name: "Customer Support Triage",
    description: "Intelligent ticket routing and sentiment analysis for customer inquiries.",
    status: "active" as const,
    category: "Customer Support",
    nodes: 12,
    executions: 8921,
    lastRun: "2 min ago",
  },
  {
    id: "3",
    name: "Project Status Reporter",
    description: "Automated project health monitoring and stakeholder reporting.",
    status: "paused" as const,
    category: "Project Management",
    nodes: 6,
    executions: 456,
    lastRun: "1 day ago",
  },
  {
    id: "4",
    name: "Resume Screening Agent",
    description: "AI-powered resume parsing and candidate matching for recruitment.",
    status: "active" as const,
    category: "Human Resources",
    nodes: 10,
    executions: 2341,
    lastRun: "15 min ago",
  },
  {
    id: "5",
    name: "Meeting Summarizer",
    description: "Automatic meeting transcription and action item extraction.",
    status: "draft" as const,
    category: "Project Management",
    nodes: 4,
    executions: 0,
    lastRun: "Never",
  },
  {
    id: "6",
    name: "FAQ Auto-Responder",
    description: "Knowledge base integration for instant customer query resolution.",
    status: "active" as const,
    category: "Customer Support",
    nodes: 7,
    executions: 5672,
    lastRun: "1 min ago",
  },
]

export function PipelineList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {pipelines.map((pipeline) => (
        <PipelineCard key={pipeline.id} {...pipeline} />
      ))}
    </div>
  )
}
