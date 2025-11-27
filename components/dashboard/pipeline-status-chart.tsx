"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "00:00", executions: 45, success: 42 },
  { time: "04:00", executions: 32, success: 30 },
  { time: "08:00", executions: 78, success: 72 },
  { time: "12:00", executions: 125, success: 118 },
  { time: "16:00", executions: 156, success: 148 },
  { time: "20:00", executions: 98, success: 94 },
  { time: "Now", executions: 112, success: 108 },
]

export function PipelineStatusChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Pipeline Executions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorExecutions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="time" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Area
                type="monotone"
                dataKey="executions"
                stroke="#4ade80"
                fill="url(#colorExecutions)"
                strokeWidth={2}
              />
              <Area type="monotone" dataKey="success" stroke="#22d3ee" fill="url(#colorSuccess)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
