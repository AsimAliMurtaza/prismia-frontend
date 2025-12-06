"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, Clock, Target, Award } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"

const hiringFunnel = [
  { stage: "Applications", count: 1247 },
  { stage: "Screened", count: 423 },
  { stage: "Interviewed", count: 156 },
  { stage: "Offered", count: 34 },
  { stage: "Hired", count: 28 },
]

const timeToHire = [
  { month: "Jun", days: 32 },
  { month: "Jul", days: 28 },
  { month: "Aug", days: 25 },
  { month: "Sep", days: 22 },
  { month: "Oct", days: 20 },
  { month: "Nov", days: 18 },
]

const sourceEffectiveness = [
  { name: "LinkedIn", value: 35, color: "#0077B5" },
  { name: "Referrals", value: 28, color: "#10b981" },
  { name: "Job Boards", value: 20, color: "#8b5cf6" },
  { name: "Career Page", value: 12, color: "#f59e0b" },
  { name: "Other", value: 5, color: "#6b7280" },
]

const departmentHiring = [
  { department: "Engineering", openings: 12, filled: 8 },
  { department: "Product", openings: 5, filled: 4 },
  { department: "Design", openings: 3, filled: 2 },
  { department: "Sales", openings: 8, filled: 6 },
  { department: "Marketing", openings: 4, filled: 3 },
]

const metrics = [
  { title: "Avg. Time to Hire", value: "18 days", change: "-4 days", trend: "down", icon: Clock },
  { title: "Offer Acceptance Rate", value: "82%", change: "+5%", trend: "up", icon: Target },
  { title: "Quality of Hire", value: "4.2/5", change: "+0.3", trend: "up", icon: Award },
  { title: "Cost per Hire", value: "$4,250", change: "-$320", trend: "down", icon: TrendingDown },
]

export function PerformanceAnalytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Performance Analytics</h2>
        <p className="text-sm text-muted-foreground">Track hiring metrics and agent performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="w-5 h-5 text-muted-foreground" />
                <Badge
                  variant="outline"
                  className={
                    metric.trend === "up"
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }
                >
                  {metric.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Hiring Funnel</CardTitle>
            <CardDescription>Candidate progression through stages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringFunnel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffffff" />
                  <XAxis type="number" stroke="#ffffffff" fontSize={12} />
                  <YAxis
                    dataKey="stage"
                    type="category"
                    stroke="#ffffffff"
                    fontSize={12}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#4ade80" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Time to Hire Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Time to Hire Trend</CardTitle>
            <CardDescription>Average days from application to offer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeToHire}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffffff" />
                  <XAxis dataKey="month" stroke="#4ade80" fontSize={12} />
                  <YAxis stroke="#4ade80" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="days"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "#4ade80", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Source Effectiveness */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Source Effectiveness</CardTitle>
            <CardDescription>Where successful hires come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceEffectiveness}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sourceEffectiveness.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Hiring */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Department Hiring Status</CardTitle>
            <CardDescription>Open positions vs filled positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentHiring}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="openings" name="Openings" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="filled" name="Filled" fill="#ffffffff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
