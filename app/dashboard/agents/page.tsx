import { Header } from "@/components/layout/header"
import { AgentsList } from "@/components/agents/agents-list"
import { AgentFilters } from "@/components/agents/agent-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function AgentsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Agents" description="Monitor and manage your AI agents" />
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">All Agents</h2>
            <p className="text-sm text-muted-foreground">6 agents deployed</p>
          </div>
          <Link href="/dashboard/agents/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Deploy Agent
            </Button>
          </Link>
        </div>
        <AgentFilters />
        <AgentsList />
      </div>
    </div>
  )
}
