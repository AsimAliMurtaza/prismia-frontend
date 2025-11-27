import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Play, Square, Settings, Activity } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface AgentCardProps {
  id: string
  name: string
  description: string
  status: "running" | "idle" | "error" | "stopped"
  type: string
  tasksCompleted: number
  tasksTotal: number
  uptime: string
  memory: number
}

const statusConfig = {
  running: { label: "Running", className: "bg-primary/20 text-primary border-primary/30", dot: "bg-primary" },
  idle: { label: "Idle", className: "bg-chart-4/20 text-chart-4 border-chart-4/30", dot: "bg-chart-4" },
  error: {
    label: "Error",
    className: "bg-destructive/20 text-destructive border-destructive/30",
    dot: "bg-destructive",
  },
  stopped: { label: "Stopped", className: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
}

export function AgentCard({
  id,
  name,
  description,
  status,
  type,
  tasksCompleted,
  tasksTotal,
  uptime,
  memory,
}: AgentCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 bg-secondary">
            <AvatarFallback className="bg-secondary text-foreground font-medium">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground">{type}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Activity className="w-4 h-4 mr-2" />
              View Logs
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete Agent</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>

        {/* Task Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Tasks</span>
            <span className="text-foreground font-medium">
              {tasksCompleted}/{tasksTotal}
            </span>
          </div>
          <Progress value={(tasksCompleted / tasksTotal) * 100} className="h-1.5" />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Uptime</span>
            <p className="text-foreground font-medium">{uptime}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Memory</span>
            <p className="text-foreground font-medium">{memory}MB</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-3 border-t border-border">
        <Badge variant="outline" className={cn("gap-1.5", statusConfig[status].className)}>
          <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig[status].dot)} />
          {statusConfig[status].label}
        </Badge>
        <Button size="sm" variant="ghost" className="h-8 gap-1.5">
          {status === "running" ? (
            <>
              <Square className="w-3.5 h-3.5" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Start
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
