import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Agent {
  id: string
  name: string
  type: string
  status: "active" | "idle" | "error"
  tasks: number
}

const agents: Agent[] = [
  { id: "1", name: "HR Assistant", type: "Human Resources", status: "active", tasks: 12 },
  { id: "2", name: "Support Bot", type: "Customer Support", status: "active", tasks: 45 },
  { id: "3", name: "PM Coordinator", type: "Project Management", status: "idle", tasks: 0 },
  { id: "4", name: "Email Processor", type: "Custom", status: "active", tasks: 8 },
]

const statusColors: Record<Agent["status"], string> = {
  active: "bg-primary/20 text-primary border-primary/30",
  idle: "bg-muted text-muted-foreground border-border",
  error: "bg-destructive/20 text-destructive border-destructive/30",
}

export function ActiveAgents() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Active Agents</CardTitle>
        <Badge variant="secondary">{agents.filter((a) => a.status === "active").length} running</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-4">
              <Avatar className="h-10 w-10 bg-secondary">
                <AvatarFallback className="bg-secondary text-foreground text-sm">
                  {agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{agent.name}</p>
                <p className="text-xs text-muted-foreground">{agent.type}</p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className={cn("capitalize", statusColors[agent.status])}>
                  {agent.status}
                </Badge>
                {agent.tasks > 0 && <p className="text-xs text-muted-foreground mt-1">{agent.tasks} tasks</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
