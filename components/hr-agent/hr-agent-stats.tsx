"use client"

import { useEffect, useState } from "react"

import {
  Users,
  FileText,
  Calendar,
  Briefcase,
  CheckCircle2,
  Clock3,
  TrendingUp,
} from "lucide-react"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import { Progress } from "@/components/ui/progress"

type DashboardData = {
  stats: {
    totalResumes: number
    totalCandidates: number
    totalScreenings: number
    activeJobs: number

    totalInterviews: number
    completedInterviews: number
    scheduledInterviews: number

    acceptedCandidates: number
    rejectedCandidates: number
  }

  recentActivity: any[]

  openPositions: any[]

  weeklyData: any[]

  hiringTrend: any[]

  topSkills: any[]

  interviewStats: any[]
}

export function HRAgentStats() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/dashboard")

        const data = await response.json()

        setDashboardData(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-sm text-muted-foreground">
            Loading analytics dashboard...
          </p>
        </div>
      </div>
    )
  }

  const statsCards = [
    {
      title: "Resumes",
      value: dashboardData?.stats.totalResumes || 0,
      icon: FileText,
      color: "text-blue-400",
    },

    {
      title: "Candidates",
      value:
        dashboardData?.stats.totalCandidates || 0,
      icon: Users,
      color: "text-emerald-400",
    },

    {
      title: "Screenings",
      value:
        dashboardData?.stats.totalScreenings || 0,
      icon: TrendingUp,
      color: "text-violet-400",
    },

    {
      title: "Active Jobs",
      value: dashboardData?.stats.activeJobs || 0,
      icon: Briefcase,
      color: "text-amber-400",
    },

    {
      title: "Interviews",
      value:
        dashboardData?.stats.totalInterviews || 0,
      icon: Calendar,
      color: "text-cyan-400",
    },

    {
      title: "Completed",
      value:
        dashboardData?.stats.completedInterviews ||
        0,
      icon: CheckCircle2,
      color: "text-green-400",
    },

    {
      title: "Scheduled",
      value:
        dashboardData?.stats.scheduledInterviews ||
        0,
      icon: Clock3,
      color: "text-yellow-400",
    },

    {
      title: "Accepted",
      value:
        dashboardData?.stats.acceptedCandidates ||
        0,
      icon: Users,
      color: "text-pink-400",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            HR Analytics Dashboard
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            AI-powered recruitment intelligence &
            hiring analytics
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsCards.map((stat) => (
          <Card
            key={stat.title}
            className="border-border/60 bg-card/70 backdrop-blur-sm hover:border-primary/20 transition-all duration-200"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>

                  <h2 className="text-3xl font-semibold mt-2 tracking-tight">
                    {stat.value}
                  </h2>
                </div>

                <div
                  className={cn(
                    "p-3 rounded-xl bg-secondary/60",
                    stat.color
                  )}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card className="border-border/60 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              Weekly Screening Activity
            </CardTitle>

            <CardDescription>
              AI screening operations performed
              weekly
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <BarChart
                  data={dashboardData?.weeklyData || []}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(255,255,255,0.03)",
                    }}
                    contentStyle={{
                      background:
                        "hsl(var(--background))",
                      border:
                        "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />

                  <Bar
                    dataKey="screenings"
                    fill="#4ade80"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Hiring Trend */}
        <Card className="border-border/60 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              Hiring Trend
            </CardTitle>

            <CardDescription>
              Successful hires over time
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="h-[320px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={dashboardData?.hiringTrend || []}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "hsl(var(--background))",
                      border:
                        "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="hires"
                    stroke="#4ade80"
                    strokeWidth={3}
                    dot={{
                      fill: "#4ade80",
                      r: 4,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border/60 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              Recent Activity
            </CardTitle>

            <CardDescription>
              Latest recruitment pipeline actions
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {dashboardData?.recentActivity?.map(
                (activity: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-secondary/20"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full",

                          activity.status ===
                            "accepted" &&
                            "bg-emerald-400",

                          activity.status ===
                            "shortlisted" &&
                            "bg-blue-400",

                          activity.status ===
                            "pending" &&
                            "bg-yellow-400",

                          activity.status ===
                            "rejected" &&
                            "bg-red-400"
                        )}
                      />

                      <div>
                        <p className="text-sm font-medium">
                          {activity.candidateName}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {activity.role}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="capitalize"
                    >
                      {activity.status}
                    </Badge>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <Card className="border-border/60 bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              Open Positions
            </CardTitle>

            <CardDescription>
              Recruitment pipeline overview
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {dashboardData?.openPositions?.map(
                (position: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border border-border/50 bg-secondary/20"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">
                          {position.title}
                        </h3>

                        <p className="text-xs text-muted-foreground mt-1">
                          {position.applicants} total
                          applicants
                        </p>
                      </div>

                      <Badge
                        variant="secondary"
                        className="rounded-full"
                      >
                        {position.shortlisted} shortlisted
                      </Badge>
                    </div>

                    <Progress
                      value={
                        position.applicants > 0
                          ? (position.shortlisted /
                              position.applicants) *
                            100
                          : 0
                      }
                      className="h-2"
                    />
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Analytics */}
      <Card className="border-border/60 bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>
            Top Candidate Skills
          </CardTitle>

          <CardDescription>
            Most frequently detected skills across
            resumes
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="h-[360px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={dashboardData?.topSkills || []}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                  vertical={false}
                />

                <XAxis
                  dataKey="_id"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                />

                <Tooltip
                  contentStyle={{
                    background:
                      "hsl(var(--background))",
                    border:
                      "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />

                <Bar
                  dataKey="count"
                  fill="#4ade80"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(
  ...classes: (string | boolean | undefined)[]
) {
  return classes.filter(Boolean).join(" ")
}