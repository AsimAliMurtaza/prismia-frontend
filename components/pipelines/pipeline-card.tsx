import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Play, Pause, GitBranch, Clock, Zap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface PipelineCardProps {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft"
  category: string
  nodes: number
  executions: number
  lastRun: string
}

const statusConfig = {
  active: { label: "Active", className: "bg-primary/20 text-primary border-primary/30" },
  paused: { label: "Paused", className: "bg-chart-4/20 text-chart-4 border-chart-4/30" },
  draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
}

export function PipelineCard({
  id,
  name,
  description,
  status,
  category,
  nodes,
  executions,
  lastRun,
}: PipelineCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-colors">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-primary" />
          </div>
          <div>
            <Link
              href={`/dashboard/pipelines/${id}`}
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {name}
            </Link>
            <p className="text-xs text-muted-foreground">{category}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>View Logs</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GitBranch className="w-3.5 h-3.5" />
            <span>{nodes} nodes</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="w-3.5 h-3.5" />
            <span>{executions.toLocaleString()} runs</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{lastRun}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-3 border-t border-border">
        <Badge variant="outline" className={cn(statusConfig[status].className)}>
          {statusConfig[status].label}
        </Badge>
        <Button size="sm" variant="ghost" className="h-8 gap-1.5">
          {status === "active" ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              Run
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
