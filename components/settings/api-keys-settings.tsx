"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Copy, Trash2, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  status: "active" | "expired"
}

const apiKeys: APIKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "sk_live_***************8x9z",
    created: "Oct 15, 2024",
    lastUsed: "2 hours ago",
    status: "active",
  },
  {
    id: "2",
    name: "Development Key",
    key: "sk_test_***************3a4b",
    created: "Nov 1, 2024",
    lastUsed: "5 min ago",
    status: "active",
  },
  {
    id: "3",
    name: "Legacy Integration",
    key: "sk_live_***************7c8d",
    created: "Aug 22, 2024",
    lastUsed: "30 days ago",
    status: "expired",
  },
]

export function APIKeysSettings() {
  const [showKey, setShowKey] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-foreground">API Keys</CardTitle>
            <CardDescription>Manage your API keys for programmatic access</CardDescription>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create New Key
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{apiKey.name}</p>
                    <Badge
                      variant="outline"
                      className={
                        apiKey.status === "active"
                          ? "bg-primary/20 text-primary border-primary/30"
                          : "bg-destructive/20 text-destructive border-destructive/30"
                      }
                    >
                      {apiKey.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-muted-foreground font-mono">
                      {showKey === apiKey.id ? "sk_live_abc123xyz789def456" : apiKey.key}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                    >
                      {showKey === apiKey.id ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created {apiKey.created} • Last used {apiKey.lastUsed}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Limits */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Usage Limits</CardTitle>
          <CardDescription>Configure rate limiting for your API keys</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Requests per minute</label>
              <Input type="number" defaultValue={1000} className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Requests per day</label>
              <Input type="number" defaultValue={100000} className="bg-secondary border-border" />
            </div>
          </div>
          <Button>Update Limits</Button>
        </CardContent>
      </Card>
    </div>
  )
}
