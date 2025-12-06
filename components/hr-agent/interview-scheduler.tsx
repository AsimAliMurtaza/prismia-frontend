"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, Video, MapPin, Plus, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const interviews = [
  {
    id: 1,
    candidate: "John Smith",
    role: "Senior Software Engineer",
    type: "Technical Interview",
    date: "Nov 27, 2025",
    time: "10:00 AM",
    duration: "60 min",
    interviewers: ["Alice Brown", "Bob Wilson"],
    location: "Video Call",
    status: "scheduled",
  },
  {
    id: 2,
    candidate: "Sarah Johnson",
    role: "Product Manager",
    type: "HR Interview",
    date: "Nov 27, 2025",
    time: "2:00 PM",
    duration: "45 min",
    interviewers: ["Carol Davis"],
    location: "Video Call",
    status: "scheduled",
  },
  {
    id: 3,
    candidate: "Mike Chen",
    role: "Data Scientist",
    type: "Final Round",
    date: "Nov 28, 2025",
    time: "11:00 AM",
    duration: "90 min",
    interviewers: ["David Lee", "Eve Taylor", "Frank Miller"],
    location: "On-site",
    status: "confirmed",
  },
  {
    id: 4,
    candidate: "Emily Davis",
    role: "UX Designer",
    type: "Portfolio Review",
    date: "Nov 28, 2025",
    time: "3:30 PM",
    duration: "60 min",
    interviewers: ["Grace Kim"],
    location: "Video Call",
    status: "pending",
  },
]

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
]

const weekDays = [
  { day: "Mon", date: "25" },
  { day: "Tue", date: "26" },
  { day: "Wed", date: "27", isToday: true },
  { day: "Thu", date: "28" },
  { day: "Fri", date: "29" },
]

export function InterviewScheduler() {
  const [selectedDate, setSelectedDate] = useState("27")

  const todayInterviews = interviews.filter((i) => i.date.includes(selectedDate))

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Interview Schedule</h2>
          <p className="text-sm text-muted-foreground">Manage and schedule candidate interviews</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Schedule Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="xl:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="font-medium text-foreground">November 2025</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Today
                  </Button>
                  <Button variant="outline" size="sm">
                    Week
                  </Button>
                  <Button variant="outline" size="sm">
                    Month
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Week Header */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {weekDays.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d.date)}
                    className={cn(
                      "p-3 rounded-lg text-center transition-colors",
                      selectedDate === d.date ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
                    )}
                  >
                    <p className="text-xs text-inherit opacity-70">{d.day}</p>
                    <p className="text-lg font-semibold">{d.date}</p>
                  </button>
                ))}
              </div>

              {/* Time Grid */}
              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {timeSlots.map((slot) => {
                  const interview = todayInterviews.find((i) => i.time === slot)
                  return (
                    <div key={slot} className="flex items-stretch gap-3 min-h-[60px]">
                      <div className="w-20 text-xs text-muted-foreground pt-2">{slot}</div>
                      <div className="flex-1 border-l border-border pl-3">
                        {interview ? (
                          <div
                            className={cn(
                              "p-3 rounded-lg border",
                              interview.status === "confirmed"
                                ? "bg-emerald-500/10 border-emerald-500/30"
                                : interview.status === "pending"
                                  ? "bg-yellow-500/10 border-yellow-500/30"
                                  : "bg-primary/10 border-primary/30",
                            )}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-foreground text-sm">{interview.candidate}</span>
                              <Badge variant="outline" className="text-xs">
                                {interview.duration}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {interview.type} - {interview.role}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              {interview.location === "Video Call" ? (
                                <Video className="w-3 h-3 text-muted-foreground" />
                              ) : (
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                              )}
                              <span className="text-xs text-muted-foreground">{interview.location}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full border-b border-border/50" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Interviews */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Upcoming Interviews</CardTitle>
              <CardDescription>{interviews.length} interviews scheduled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {interviews.map((interview) => (
                <div
                  key={interview.id}
                  className="p-3 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-foreground text-xs">
                        {interview.candidate
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{interview.candidate}</p>
                      <p className="text-xs text-muted-foreground">{interview.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {interview.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {interview.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{interview.interviewers.join(", ")}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                Schedule New Interview
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Video className="w-4 h-4" />
                Create Meeting Link
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <Users className="w-4 h-4" />
                Check Availability
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
