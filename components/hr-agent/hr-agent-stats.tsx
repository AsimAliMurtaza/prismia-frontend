"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, FileText, Calendar, TrendingUp, Briefcase } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip } from "recharts"

const statsCards = [
  { title: "Resumes Screened", value: "1,247", change: "+18%", icon: FileText, color: "text-blue-400" },
  { title: "Active Candidates", value: "89", change: "+12%", icon: Users, color: "text-emerald-400" },
  { title: "Interviews Scheduled", value: "34", change: "+8%", icon: Calendar, color: "text-purple-400" },
  { title: "Offers Extended", value: "12", change: "+25%", icon: Briefcase, color: "text-amber-400" },
]

const weeklyData = [
  { day: "Mon", resumes: 45, interviews: 8 },
  { day: "Tue", resumes: 52, interviews: 12 },
  { day: "Wed", resumes: 38, interviews: 6 },
  { day: "Thu", resumes: 65, interviews: 15 },
  { day: "Fri", resumes: 48, interviews: 10 },
  { day: "Sat", resumes: 20, interviews: 3 },
  { day: "Sun", resumes: 15, interviews: 2 },
]

const hiringTrend = [
  { month: "Jan", hires: 8 },
  { month: "Feb", hires: 12 },
  { month: "Mar", hires: 15 },
  { month: "Apr", hires: 10 },
  { month: "May", hires: 18 },
  { month: "Jun", hires: 22 },
]

const recentActivity = [
  {
    id: 1,
    action: "Resume screened",
    candidate: "John Smith",
    role: "Software Engineer",
    time: "2 min ago",
    status: "qualified",
  },
  {
    id: 2,
    action: "Interview scheduled",
    candidate: "Sarah Johnson",
    role: "Product Manager",
    time: "15 min ago",
    status: "pending",
  },
  {
    id: 3,
    action: "Offer generated",
    candidate: "Mike Chen",
    role: "Data Analyst",
    time: "1 hour ago",
    status: "completed",
  },
  {
    id: 4,
    action: "Onboarding started",
    candidate: "Emily Davis",
    role: "UX Designer",
    time: "2 hours ago",
    status: "in-progress",
  },
  {
    id: 5,
    action: "Resume rejected",
    candidate: "Tom Wilson",
    role: "Marketing Lead",
    time: "3 hours ago",
    status: "rejected",
  },
]

const openPositions = [
  { role: "Senior Software Engineer", applicants: 156, shortlisted: 12, department: "Engineering" },
  { role: "Product Manager", applicants: 89, shortlisted: 8, department: "Product" },
  { role: "Data Scientist", applicants: 124, shortlisted: 15, department: "Data" },
  { role: "UX Designer", applicants: 67, shortlisted: 6, department: "Design" },
]

export function HRAgentStats() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-primary mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change} this week
                  </p>
                </div>
                <div className={cn("p-3 rounded-lg bg-secondary", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Weekly Activity Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Activity</CardTitle>
            <CardDescription>Resumes screened and interviews scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="resumes" fill="#4ade80" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="interviews" fill="#ffffffff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hiring Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Hiring Trend</CardTitle>
            <CardDescription>Monthly successful hires</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hiringTrend}>
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
                    dataKey="hires"
                    stroke="#4ade80"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription>Latest actions performed by the HR Agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      activity.status === "qualified" && "bg-emerald-400",
                      activity.status === "pending" && "bg-yellow-400",
                      activity.status === "completed" && "bg-blue-400",
                      activity.status === "in-progress" && "bg-purple-400",
                      activity.status === "rejected" && "bg-red-400",
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.candidate} - {activity.role}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Open Positions</CardTitle>
            <CardDescription>Current job openings and applicant status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {openPositions.map((position) => (
                <div key={position.role} className="p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{position.role}</p>
                      <p className="text-xs text-muted-foreground">{position.department}</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {position.shortlisted} shortlisted
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Screening Progress</span>
                      <span className="text-foreground">{position.applicants} applicants</span>
                    </div>
                    <Progress value={(position.shortlisted / position.applicants) * 100} className="h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
