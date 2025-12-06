"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { UserPlus, FileText, Mail, Key, Laptop, BookOpen, Users, CheckCircle, Clock, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const newHires = [
  {
    id: 1,
    name: "Mike Chen",
    role: "Data Scientist",
    department: "Data",
    startDate: "Dec 1, 2025",
    progress: 75,
    status: "in-progress",
    tasks: [
      { id: 1, title: "Contract signed", completed: true },
      { id: 2, title: "Background check", completed: true },
      { id: 3, title: "Equipment ordered", completed: true },
      { id: 4, title: "Accounts created", completed: false },
      { id: 5, title: "Orientation scheduled", completed: false },
    ],
  },
  {
    id: 2,
    name: "Lisa Wang",
    role: "Frontend Developer",
    department: "Engineering",
    startDate: "Dec 4, 2025",
    progress: 40,
    status: "in-progress",
    tasks: [
      { id: 1, title: "Contract signed", completed: true },
      { id: 2, title: "Background check", completed: true },
      { id: 3, title: "Equipment ordered", completed: false },
      { id: 4, title: "Accounts created", completed: false },
      { id: 5, title: "Orientation scheduled", completed: false },
    ],
  },
  {
    id: 3,
    name: "James Wilson",
    role: "Sales Manager",
    department: "Sales",
    startDate: "Dec 8, 2025",
    progress: 20,
    status: "pending",
    tasks: [
      { id: 1, title: "Contract signed", completed: true },
      { id: 2, title: "Background check", completed: false },
      { id: 3, title: "Equipment ordered", completed: false },
      { id: 4, title: "Accounts created", completed: false },
      { id: 5, title: "Orientation scheduled", completed: false },
    ],
  },
]

const onboardingSteps = [
  { icon: FileText, title: "Documentation", description: "Collect and verify employment documents" },
  { icon: Key, title: "Access Setup", description: "Create accounts and system access" },
  { icon: Laptop, title: "Equipment", description: "Provision laptop and necessary hardware" },
  { icon: BookOpen, title: "Training", description: "Schedule required training modules" },
  { icon: Users, title: "Team Introduction", description: "Meet the team and assign mentor" },
]

export function EmployeeOnboarding() {
  const [selectedHire, setSelectedHire] = useState(newHires[0])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Employee Onboarding</h2>
          <p className="text-sm text-muted-foreground">Manage new hire onboarding workflows</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="w-4 h-4" />
          Add New Hire
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <UserPlus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">New hires this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-xs text-muted-foreground">In progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">92%</p>
                <p className="text-xs text-muted-foreground">Avg. completion rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* New Hires List */}
        <div>
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-base">New Hires</CardTitle>
              <CardDescription>Click to view onboarding details</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {newHires.map((hire) => (
                  <button
                    key={hire.id}
                    onClick={() => setSelectedHire(hire)}
                    className={cn(
                      "w-full p-4 text-left transition-colors hover:bg-secondary/50",
                      selectedHire.id === hire.id && "bg-secondary",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {hire.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">{hire.name}</p>
                        <p className="text-xs text-muted-foreground">{hire.role}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">{hire.progress}%</span>
                      </div>
                      <Progress value={hire.progress} className="h-1.5" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Starts: {hire.startDate}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onboarding Details */}
        <div className="xl:col-span-2 space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedHire.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-foreground">{selectedHire.name}</CardTitle>
                    <CardDescription>
                      {selectedHire.role} - {selectedHire.department}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    selectedHire.status === "in-progress"
                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                      : "bg-gray-500/20 text-gray-400 border-gray-500/30",
                  )}
                >
                  {selectedHire.status === "in-progress" ? "In Progress" : "Pending"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="text-foreground font-medium">{selectedHire.progress}%</span>
                </div>
                <Progress value={selectedHire.progress} className="h-2" />
              </div>

              <h4 className="text-sm font-medium text-foreground mb-3">Onboarding Checklist</h4>
              <div className="space-y-3">
                {selectedHire.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                      task.completed ? "bg-emerald-500/10 border-emerald-500/20" : "bg-secondary/30 border-border",
                    )}
                  >
                    <Checkbox checked={task.completed} />
                    <span
                      className={cn(
                        "text-sm",
                        task.completed ? "text-muted-foreground line-through" : "text-foreground",
                      )}
                    >
                      {task.title}
                    </span>
                    {task.completed && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button className="gap-2">
                  <Mail className="w-4 h-4" />
                  Send Welcome Email
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowRight className="w-4 h-4" />
                  Complete Next Step
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Onboarding Steps */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Onboarding Workflow</CardTitle>
              <CardDescription>Standard steps for all new hires</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {onboardingSteps.map((step, index) => (
                  <div key={step.title} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                          index < 2 ? "bg-emerald-500/20 text-emerald-400" : "bg-secondary text-muted-foreground",
                        )}
                      >
                        <step.icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-foreground font-medium text-center">{step.title}</p>
                    </div>
                    {index < onboardingSteps.length - 1 && (
                      <div className={cn("w-12 h-0.5 mx-2", index < 1 ? "bg-emerald-500" : "bg-border")} />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
