"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, FileText, Users, Calendar, UserPlus, BarChart3, MessageSquare, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { HRView } from "./hr-agent-dashboard"

interface HRAgentSidebarProps {
  activeView: HRView
  onViewChange: (view: HRView) => void
}

const menuItems = [
  { id: "overview" as const, label: "Overview", icon: LayoutDashboard },
  { id: "resume" as const, label: "Resume Screening", icon: FileText },
  { id: "candidates" as const, label: "Candidates", icon: Users },
  { id: "interviews" as const, label: "Interviews", icon: Calendar },
  { id: "onboarding" as const, label: "Onboarding", icon: UserPlus },
  { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  { id: "chat" as const, label: "Interact with Agent", icon: MessageSquare },
]

export function HRAgentSidebar({ activeView, onViewChange }: HRAgentSidebarProps) {
  return (
    <div className="w-64 border-r border-border bg-card/50 p-4 flex flex-col">
      <Link href="/dashboard/agents">
        <Button variant="ghost" className="w-full justify-start gap-2 mb-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back to Agents
        </Button>
      </Link>

      <div className="flex items-center gap-3 px-3 py-4 mb-4 rounded-lg bg-primary/10 border border-primary/20">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-foreground text-sm">HR Agent</h3>
          <p className="text-xs text-primary">Active</p>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              activeView === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary",
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="px-3 py-2 rounded-lg bg-secondary/50">
          <p className="text-xs text-muted-foreground mb-1">Tasks Processed Today</p>
          <p className="text-2xl font-bold text-foreground">247</p>
        </div>
      </div>
    </div>
  )
}
