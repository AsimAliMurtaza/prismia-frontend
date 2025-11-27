import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, GitBranch, Bot } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Create Pipeline",
    description: "Build a new AI workflow",
    icon: GitBranch,
    href: "/dashboard/pipelines/new",
  },
  {
    title: "Deploy Agent",
    description: "Launch an intelligent agent",
    icon: Bot,
    href: "/dashboard/agents/new",
  },
  {
    title: "Import Template",
    description: "Use a pre-built template",
    icon: Upload,
    href: "/dashboard/templates",
  },
  {
    title: "Add Integration",
    description: "Connect external services",
    icon: Plus,
    href: "/dashboard/settings/integrations",
  },
]

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto flex-col items-start gap-2 p-4 bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50 transition-colors"
              >
                <action.icon className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
