"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Plus,
  ArrowRight,
  Trash2,
  GripVertical,
  MessageSquare,
  Database,
  Zap,
  Brain,
  FileText,
  Mail,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Node {
  id: string
  type: string
  name: string
  icon: React.ElementType
}

const nodeTypes = [
  { type: "input", name: "Input Handler", icon: MessageSquare, color: "text-chart-2" },
  { type: "processor", name: "Data Processor", icon: Database, color: "text-chart-4" },
  { type: "llm", name: "LLM Agent", icon: Brain, color: "text-primary" },
  { type: "action", name: "Action Node", icon: Zap, color: "text-chart-3" },
  { type: "document", name: "Document Parser", icon: FileText, color: "text-chart-5" },
  { type: "email", name: "Email Handler", icon: Mail, color: "text-chart-2" },
]

export function PipelineBuilder() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", type: "input", name: "Input Handler", icon: MessageSquare },
    { id: "2", type: "llm", name: "LLM Agent", icon: Brain },
    { id: "3", type: "action", name: "Action Node", icon: Zap },
  ])

  const addNode = (nodeType: (typeof nodeTypes)[0]) => {
    setNodes([...nodes, { id: Date.now().toString(), type: nodeType.type, name: nodeType.name, icon: nodeType.icon }])
  }

  const removeNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Node Palette */}
      <Card className="bg-card border-border lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Node Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {nodeTypes.map((nodeType) => (
            <button
              key={nodeType.type}
              onClick={() => addNode(nodeType)}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary border border-border hover:border-primary/30 transition-colors text-left"
            >
              <nodeType.icon className={cn("w-4 h-4", nodeType.color)} />
              <span className="text-sm text-foreground">{nodeType.name}</span>
              <Plus className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Pipeline Canvas */}
      <Card className="bg-card border-border lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Pipeline Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-[400px] p-4 bg-secondary/30 rounded-lg border border-border border-dashed">
            {nodes.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Drag nodes here to build your pipeline</p>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                {nodes.map((node, index) => {
                  const nodeType = nodeTypes.find((t) => t.type === node.type)
                  return (
                    <div key={node.id} className="flex items-center gap-4">
                      <div className="group relative flex items-center gap-2 p-4 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors">
                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                        <node.icon className={cn("w-5 h-5", nodeType?.color || "text-foreground")} />
                        <span className="text-sm font-medium text-foreground">{node.name}</span>
                        <button
                          onClick={() => removeNode(node.id)}
                          className="absolute -top-2 -right-2 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3 text-destructive-foreground" />
                        </button>
                      </div>
                      {index < nodes.length - 1 && <ArrowRight className="w-5 h-5 text-muted-foreground" />}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
