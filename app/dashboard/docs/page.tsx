import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Book, Code, Zap, Video, ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

const docs = [
  {
    title: "Getting Started",
    description: "Learn the basics of creating your first pipeline and deploying agents.",
    icon: Zap,
    href: "#",
    items: ["Quick Start Guide", "Core Concepts", "Your First Pipeline"],
  },
  {
    title: "Pipeline Development",
    description: "Deep dive into building complex pipelines with custom nodes.",
    icon: Code,
    href: "#",
    items: ["Node Types", "Data Flow", "Error Handling", "Testing"],
  },
  {
    title: "Agent Configuration",
    description: "Configure and optimize your AI agents for production.",
    icon: Book,
    href: "#",
    items: ["Agent Types", "Memory Management", "Scaling", "Monitoring"],
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step video guides for common workflows.",
    icon: Video,
    href: "#",
    items: ["HR Pipeline Setup", "Support Bot", "Custom Integrations"],
  },
]

export default function DocsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Documentation" description="Learn how to build and deploy AI agents" />
      <div className="flex-1 p-6">
        <div className="max-w-4xl">
          {/* Hero */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to AgentFlow Docs</h2>
            <p className="text-muted-foreground">
              Everything you need to know about building intelligent AI agents and workflows.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {docs.map((doc) => (
              <Card key={doc.title} className="bg-card border-border hover:border-primary/30 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <doc.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-foreground">{doc.title}</CardTitle>
                      <CardDescription className="text-xs">{doc.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {doc.items.map((item) => (
                      <li key={item}>
                        <Link
                          href="#"
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary">
                    View All
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* API Reference */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">API Reference</CardTitle>
              <CardDescription>Complete API documentation for developers</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Explore our REST API and SDK documentation for programmatic access.
              </p>
              <Button variant="outline" className="gap-2 bg-transparent">
                <ExternalLink className="w-4 h-4" />
                Open API Docs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
