import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Activity {
  id: string
  type: "pipeline" | "agent" | "deployment" | "error"
  title: string
  description: string
  timestamp: string
}

const activities: Activity[] = [
  {
    id: "1",
    type: "deployment",
    title: "HR Agent deployed",
    description: "Successfully deployed to production",
    timestamp: "2 min ago",
  },
  {
    id: "2",
    type: "pipeline",
    title: "Customer Support Pipeline updated",
    description: "Added new intent classification node",
    timestamp: "15 min ago",
  },
  {
    id: "3",
    type: "agent",
    title: "Project Manager Agent created",
    description: "New agent from PM template",
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "error",
    title: "Pipeline execution failed",
    description: "Timeout in data processing node",
    timestamp: "2 hours ago",
  },
  {
    id: "5",
    type: "pipeline",
    title: "Email Processing Pipeline created",
    description: "New custom pipeline",
    timestamp: "3 hours ago",
  },
]

const typeColors: Record<Activity["type"], string> = {
  pipeline: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  agent: "bg-primary/20 text-primary border-primary/30",
  deployment: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  error: "bg-destructive/20 text-destructive border-destructive/30",
}

export function ActivityFeed() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <Badge variant="outline" className={cn("capitalize shrink-0", typeColors[activity.type])}>
                {activity.type}
              </Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
