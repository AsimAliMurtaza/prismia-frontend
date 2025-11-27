"use client"

import { TemplateCard } from "./template-card"

const templates = [
  {
    id: "1",
    name: "Employee Onboarding Suite",
    description:
      "Complete workflow for new employee onboarding including document processing, training assignment, and progress tracking.",
    category: "hr" as const,
    features: ["Document Processing", "Task Assignment", "Progress Tracking", "Email Automation", "Compliance Checks"],
    usageCount: 2341,
    rating: 4.8,
    featured: true,
  },
  {
    id: "2",
    name: "Customer Ticket Triage",
    description: "AI-powered ticket classification, priority assignment, and intelligent routing to support teams.",
    category: "cs" as const,
    features: ["Sentiment Analysis", "Auto-Routing", "Priority Scoring", "SLA Tracking"],
    usageCount: 5672,
    rating: 4.9,
    featured: true,
  },
  {
    id: "3",
    name: "Sprint Manager",
    description: "Automated sprint planning, task distribution, and daily standup facilitation for agile teams.",
    category: "pm" as const,
    features: ["Sprint Planning", "Task Distribution", "Progress Reports", "Standup Automation"],
    usageCount: 1823,
    rating: 4.7,
    featured: true,
  },
  {
    id: "4",
    name: "Resume Screener",
    description: "Intelligent resume parsing and candidate matching based on job requirements.",
    category: "hr" as const,
    features: ["Resume Parsing", "Skill Matching", "Scoring", "Shortlisting"],
    usageCount: 3456,
    rating: 4.6,
  },
  {
    id: "5",
    name: "FAQ Auto-Responder",
    description: "Knowledge base integration for instant responses to common customer queries.",
    category: "cs" as const,
    features: ["KB Integration", "Intent Detection", "Response Generation", "Escalation"],
    usageCount: 4521,
    rating: 4.5,
  },
  {
    id: "6",
    name: "Project Health Monitor",
    description: "Real-time project status tracking with automated risk assessment and stakeholder reporting.",
    category: "pm" as const,
    features: ["Risk Assessment", "Status Reports", "Milestone Tracking", "Alerts"],
    usageCount: 1234,
    rating: 4.4,
  },
  {
    id: "7",
    name: "Interview Scheduler",
    description: "Coordinate interview scheduling with calendar integration and candidate communication.",
    category: "hr" as const,
    features: ["Calendar Sync", "Availability Check", "Reminders", "Feedback Collection"],
    usageCount: 2198,
    rating: 4.7,
  },
  {
    id: "8",
    name: "Feedback Analyzer",
    description: "Analyze customer feedback at scale with sentiment analysis and trend identification.",
    category: "cs" as const,
    features: ["Sentiment Analysis", "Trend Detection", "Theme Extraction", "Reports"],
    usageCount: 1876,
    rating: 4.3,
  },
  {
    id: "9",
    name: "Resource Allocator",
    description: "Optimize team resource allocation based on skills, availability, and project needs.",
    category: "pm" as const,
    features: ["Skill Matching", "Capacity Planning", "Conflict Resolution", "Forecasting"],
    usageCount: 987,
    rating: 4.5,
  },
]

interface TemplatesListProps {
  filter?: string
}

export function TemplatesList({ filter }: TemplatesListProps) {
  const filteredTemplates = filter && filter !== "all" ? templates.filter((t) => t.category === filter) : templates

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {filteredTemplates.map((template) => (
        <TemplateCard key={template.id} {...template} />
      ))}
    </div>
  )
}
