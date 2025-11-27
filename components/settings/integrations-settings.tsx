"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

interface Integration {
  id: string
  name: string
  description: string
  logo: string
  connected: boolean
  category: string
}

const integrations: Integration[] = [
  {
    id: "1",
    name: "Slack",
    description: "Send notifications and updates to Slack channels",
    logo: "S",
    connected: true,
    category: "Communication",
  },
  {
    id: "2",
    name: "GitHub",
    description: "Trigger pipelines on repository events",
    logo: "G",
    connected: true,
    category: "Development",
  },
  {
    id: "3",
    name: "Jira",
    description: "Sync tasks and create issues automatically",
    logo: "J",
    connected: false,
    category: "Project Management",
  },
  {
    id: "4",
    name: "Salesforce",
    description: "Integrate with CRM data and workflows",
    logo: "SF",
    connected: false,
    category: "CRM",
  },
  {
    id: "5",
    name: "HubSpot",
    description: "Connect marketing and sales automation",
    logo: "H",
    connected: true,
    category: "Marketing",
  },
  {
    id: "6",
    name: "Zendesk",
    description: "Route tickets and sync customer data",
    logo: "Z",
    connected: false,
    category: "Support",
  },
  {
    id: "7",
    name: "Notion",
    description: "Sync documents and knowledge bases",
    logo: "N",
    connected: true,
    category: "Productivity",
  },
  {
    id: "8",
    name: "Google Workspace",
    description: "Access Gmail, Drive, and Calendar",
    logo: "G",
    connected: true,
    category: "Productivity",
  },
]

export function IntegrationsSettings() {
  const categories = [...new Set(integrations.map((i) => i.category))]

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category} className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">{category}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations
                .filter((i) => i.category === category)
                .map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
                        {integration.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{integration.name}</p>
                          {integration.connected && (
                            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                              Connected
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{integration.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {integration.connected ? (
                        <>
                          <Switch defaultChecked />
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </>
                      ) : (
                        <Button size="sm">Connect</Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
