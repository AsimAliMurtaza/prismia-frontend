"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export function PipelineConfig() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Basic Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Pipeline Name</Label>
            <Input id="name" placeholder="My Pipeline" className="bg-secondary border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this pipeline does..."
              className="bg-secondary border-border min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hr">Human Resources</SelectItem>
                <SelectItem value="pm">Project Management</SelectItem>
                <SelectItem value="cs">Customer Support</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Pipeline Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-retry on failure</Label>
              <p className="text-xs text-muted-foreground">Automatically retry failed executions</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable logging</Label>
              <p className="text-xs text-muted-foreground">Log all pipeline executions</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Webhook notifications</Label>
              <p className="text-xs text-muted-foreground">Send webhook on completion</p>
            </div>
            <Switch />
          </div>
          <div className="space-y-2">
            <Label htmlFor="timeout">Timeout (seconds)</Label>
            <Input id="timeout" type="number" defaultValue={30} className="bg-secondary border-border" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
