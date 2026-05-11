"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, FileText, Mail, Key, Laptop, BookOpen, Users, CheckCircle, Clock, Sparkles, Loader2, XCircle, RefreshCw, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

// ── types ─────────────────────────────────────────────────────────────────────

interface Task {
  id: number
  title: string
  completed: boolean
  field: string
}

interface NewHire {
  id: string
  name: string
  role: string
  email: string
  progress: number
  status: "pending" | "in-progress" | "completed"
  onboardingStatus: string
  tasks: Task[]
}

interface PendingEmployee {
  id: string
  name: string
  role: string
  email: string
}

interface Notification {
  id: string
  message: string
  type: "info" | "success" | "warning" | "processing"
  timestamp: Date
}

// ── constants ─────────────────────────────────────────────────────────────────

const BASE = "http://localhost:8000/onboarding"

const STATUS_MESSAGES: Record<string, { message: string; type: Notification["type"] }> = {
  pending:             { message: "Onboarding process starting...",          type: "processing" },
  access_setup:        { message: "✓ System accounts created",               type: "success" },
  equipment_assigned:  { message: "✓ Equipment assigned",                    type: "success" },
  training_scheduled:  { message: "✓ Training and orientation scheduled",    type: "success" },
  tasks_assigned:      { message: "✓ Initial tasks assigned",                type: "success" },
  awaiting_documents:  { message: "📧 Document request email sent to candidate. Waiting for submission...", type: "warning" },
  documents_received:  { message: "📄 Candidate submitted their documents!", type: "success" },
  completed:           { message: "🎉 Welcome email sent! Onboarding complete.", type: "success" },
}

// ── helpers ───────────────────────────────────────────────────────────────────

function buildTasks(record: any): Task[] {
  return [
    { id: 1, title: "Documents collected",     field: "documents_collected", completed: record.documents_collected?.length > 0 && record.documents_submitted_by_candidate },
    { id: 2, title: "Accounts & access setup", field: "access_list",         completed: record.access_list?.length > 0 },
    { id: 3, title: "Equipment assigned",      field: "equipment_list",      completed: record.equipment_list?.length > 0 },
    { id: 4, title: "Training scheduled",      field: "training_plan",       completed: record.training_plan?.length > 0 },
    { id: 5, title: "Tasks assigned",          field: "initial_tasks",       completed: record.initial_tasks?.length > 0 },
  ]
}

function calculateProgress(record: any): number {
  if (record.onboarding_status === "completed") return 100
  const fields = ["documents_collected", "access_list", "equipment_list", "training_plan", "initial_tasks"]
  // documents only count if actually submitted by candidate
  const done = fields.filter(f => {
    if (f === "documents_collected") return record.documents_submitted_by_candidate
    return record[f]?.length > 0
  }).length
  return Math.round((done / fields.length) * 100)
}

function mapStatus(status: string): NewHire["status"] {
  if (status === "completed") return "completed"
  if (status === "pending") return "pending"
  return "in-progress"
}

function mapRecord(r: any): NewHire {
  return {
    id: String(r.candidate_id),
    name: r.full_name,
    role: r.job_role,
    email: r.email ?? "",
    progress: calculateProgress(r),
    status: mapStatus(r.onboarding_status),
    onboardingStatus: r.onboarding_status,
    tasks: buildTasks(r),
  }
}

const ONBOARDING_STEPS = [
  { icon: FileText, title: "Documents" },
  { icon: Key,      title: "Access" },
  { icon: Laptop,   title: "Equipment" },
  { icon: BookOpen, title: "Training" },
  { icon: Users,    title: "Tasks" },
]

// ── component ─────────────────────────────────────────────────────────────────

export function EmployeeOnboarding() {
  const [newHires, setNewHires]                     = useState<NewHire[]>([])
  const [selectedHire, setSelectedHire]             = useState<NewHire | null>(null)
  const [pendingEmployees, setPendingEmployees]     = useState<PendingEmployee[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen]             = useState(false)
  const [loading, setLoading]                       = useState(true)
  const [actionLoading, setActionLoading]           = useState(false)
  const [notifications, setNotifications]           = useState<Notification[]>([])

  // track which candidates are actively being polled
  const pollingRefs = useRef<Record<string, NodeJS.Timeout>>({})
  // track last known status per candidate to detect changes
  const lastStatus  = useRef<Record<string, string>>({})

  // ── notification helpers ────────────────────────────────────────────────────

  const addNotification = (message: string, type: Notification["type"]) => {
    const id = `${Date.now()}-${Math.random()}`
    const notification: Notification = { id, message, type, timestamp: new Date() }
    setNotifications(prev => [notification, ...prev.slice(0, 9)])

    // auto remove after 10 seconds unless it's a warning (document waiting)
    if (type !== "warning") {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, 10000)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // ── load data ───────────────────────────────────────────────────────────────

  const loadData = async () => {
    try {
      const [hiredRes, recordsRes] = await Promise.all([
        fetch(`${BASE}/hired`).then(r => r.json()),
        fetch(`${BASE}/all-records`).then(r => r.json()),
      ])

      const records: NewHire[] = (recordsRes.records ?? []).map(mapRecord)
      setNewHires(records)

      setSelectedHire(prev =>
        prev
          ? records.find(r => r.id === prev.id) ?? records[0] ?? null
          : records[0] ?? null
      )

      const onboardedIds = new Set(records.map(r => r.id))
      const pending: PendingEmployee[] = (hiredRes.employees ?? [])
        .filter((e: any) => !onboardedIds.has(String(e.candidate_id)))
        .map((e: any) => ({
          id: String(e.candidate_id),
          name: e.full_name,
          role: e.job_role,
          email: e.email ?? "",
        }))
      setPendingEmployees(pending)

      // resume polling for any in-progress candidates
      records.forEach(hire => {
        if (
          hire.status === "in-progress" ||
          hire.onboardingStatus === "awaiting_documents"
        ) {
          if (!pollingRefs.current[hire.id]) {
            lastStatus.current[hire.id] = hire.onboardingStatus
            startPolling(hire.id, hire.name)
          }
        }
      })


    } catch (err) {
      console.error("Failed to load data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    return () => {
      // cleanup all polling on unmount
      Object.values(pollingRefs.current).forEach(clearInterval)
    }
  }, [])

  // ── polling — the heart of the live triggers ────────────────────────────────


const startPolling = (candidate_id: string, name: string) => {
  // clear any existing poll for this candidate first
  if (pollingRefs.current[candidate_id]) {
    clearInterval(pollingRefs.current[candidate_id])
    delete pollingRefs.current[candidate_id]
  }

  const interval = setInterval(async () => {
    try {
      const res = await fetch(`${BASE}/status/${candidate_id}`)
        
        .then(r => r.json())

      const currentStatus = res.status
      
      // ── detect status change → show notification ──────────────────────
      if (lastStatus.current[candidate_id] !== currentStatus) {
        const prev = lastStatus.current[candidate_id]
        lastStatus.current[candidate_id] = currentStatus

        console.log(`[POLL] ${name}: ${prev} → ${currentStatus}`)

        const statusInfo = STATUS_MESSAGES[currentStatus]
        if (statusInfo) {
          addNotification(`${name}: ${statusInfo.message}`, statusInfo.type)
        }

        // special triggers
        if (currentStatus === "documents_received") {
          addNotification(
            `${name}: 📄 Documents submitted! Sending welcome email...`,
            "success"
          )
        }

        if (currentStatus === "completed") {
          addNotification(
            `${name}: 🎉 Welcome email sent! Onboarding complete.`,
            "success"
          )
        }
      }

      // ── update hire in list ───────────────────────────────────────────
      const updatedHire = {
        progress: res.progress,
        status: (
          currentStatus === "completed" ? "completed" :
          currentStatus === "pending"   ? "pending"   : "in-progress"
        ) as "completed" | "pending" | "in-progress",
        onboardingStatus: currentStatus,
        tasks: [
          {
            id: 1,
            title: "Documents collected",
            field: "documents_collected",
            completed: res.documents_submitted === true,
          },
          {
            id: 2,
            title: "Accounts & access setup",
            field: "access_list",
            completed: res.completed_steps?.includes("access_list") ?? false,
          },
          {
            id: 3,
            title: "Equipment assigned",
            field: "equipment_list",
            completed: res.completed_steps?.includes("equipment_list") ?? false,
          },
          {
            id: 4,
            title: "Training scheduled",
            field: "training_plan",
            completed: res.completed_steps?.includes("training_plan") ?? false,
          },
          {
            id: 5,
            title: "Tasks assigned",
            field: "initial_tasks",
            completed: res.completed_steps?.includes("initial_tasks") ?? false,
          },
        ],
      }

      setNewHires(prev =>
        prev.map(h => h.id !== candidate_id ? h : { ...h, ...updatedHire })
      )

      setSelectedHire(prev => {
        if (!prev || prev.id !== candidate_id) return prev
        return { ...prev, ...updatedHire }
      })

      // ── stop polling when fully done ──────────────────────────────────
      if (currentStatus === "completed") {
        clearInterval(pollingRefs.current[candidate_id])
        delete pollingRefs.current[candidate_id]

        await loadData()
      }

    } catch (err) {
      console.error("[POLL ERROR]", err)
    }
  }, 3000) // poll every 3 seconds

  pollingRefs.current[candidate_id] = interval
}
  // ── start onboarding ────────────────────────────────────────────────────────

  const handleStartOnboarding = async () => {
  const employee = pendingEmployees.find(e => e.id === selectedEmployeeId)
  if (!employee) return

  setActionLoading(true)
  setIsDialogOpen(false)

  try {
    addNotification(`Starting onboarding for ${employee.name}...`, "processing")

    // step 1 — create record
    await fetch(`${BASE}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidate_id: employee.id,
        full_name: employee.name,
        email: employee.email,
        job_role: employee.role,
        decision: "hired",
      }),
    }).then(r => r.json())

    await loadData()

    // step 2 — trigger agent (runs in background, returns immediately)
    fetch(`${BASE}/run-agent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        candidate_id: employee.id,
        job_role: employee.role,
      }),
    }) // no await — intentional

    // step 3 — start polling immediately
    lastStatus.current[employee.id] = "pending"
    startPolling(employee.id, employee.name)

    setSelectedEmployeeId("")

  } catch (err) {
    console.error("Failed:", err)
    addNotification("Failed to start onboarding.", "warning")
  } finally {
    setActionLoading(false)
  }
}

  // ── sync new hires ──────────────────────────────────────────────────────────

  const handleSync = async () => {
    setActionLoading(true)
    addNotification("Checking for new hired candidates...", "processing")
    try {
      const res = await fetch(`${BASE}/auto-detect-and-onboard`, {
        method: "POST",
      }).then(r => r.json())

      if (res.detected > 0) {
        addNotification(
          `Found ${res.detected} new hire(s). Onboarding started automatically.`,
          "success"
        )
        await loadData()
      } else {
        addNotification(res.message ?? "No new candidates found.", "info")
      }
    } catch {
      addNotification("Sync failed. Check your backend.", "warning")
    } finally {
      setActionLoading(false)
    }
  }

  // ── manual welcome email ────────────────────────────────────────────────────

  

  // ── manual check documents ──────────────────────────────────────────────────

  const handleCheckDocuments = async () => {
    if (!selectedHire) return
    setActionLoading(true)
    try {
      const res = await fetch(
        `${BASE}/check-documents/${selectedHire.id}`,
        { method: "POST" }
      ).then(r => r.json())

      if (res.submitted) {
        addNotification(
          `✓ Documents received from ${selectedHire.name}! Welcome email being sent.`,
          "success"
        )
        await loadData()
      } else {
        addNotification(
          `${selectedHire.name} has not submitted documents yet.`,
          "warning"
        )
      }
    } catch {
      addNotification("Failed to check documents.", "warning")
    } finally {
      setActionLoading(false)
    }
  }
  // ── stats ───────────────────────────────────────────────────────────────────

  const stats = {
    total:      newHires.length,
    inProgress: newHires.filter(h => h.status === "in-progress").length,
    completed:  newHires.filter(h => h.status === "completed").length,
    avgRate:    newHires.length > 0
      ? Math.round(newHires.reduce((acc, h) => acc + h.progress, 0) / newHires.length)
      : 0,
  }

  const activePollingCount = Object.keys(pollingRefs.current).length

  // ── loading ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">Loading onboarding data...</span>
      </div>
    )
  }

  // ── render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* live notifications panel */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              className={cn(
                "flex items-start justify-between gap-3 p-3 rounded-lg border text-sm",
                n.type === "success"    && "bg-emerald-500/10 border-emerald-500/20 text-emerald-700",
                n.type === "warning"    && "bg-yellow-500/10 border-yellow-500/20 text-yellow-700",
                n.type === "processing" && "bg-blue-500/10 border-blue-500/20 text-blue-700",
                n.type === "info"       && "bg-secondary border-border text-muted-foreground",
              )}
            >
              <div className="flex items-center gap-2">
                {n.type === "processing" && (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                )}
                {n.type === "success" && (
                  <CheckCircle className="w-4 h-4 shrink-0" />
                )}
                {n.type === "warning" && (
                  <Clock className="w-4 h-4 shrink-0" />
                )}
                {n.type === "info" && (
                  <Bell className="w-4 h-4 shrink-0" />
                )}
                <span>{n.message}</span>
              </div>
              <button
                onClick={() => removeNotification(n.id)}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* active polling indicator */}
      {activePollingCount > 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live updates active for {activePollingCount} candidate(s)
        </div>
      )}

      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Employee Onboarding</h2>
          <p className="text-sm text-muted-foreground">
            Manage new hire onboarding workflows
          </p>
        </div>
        <div className="flex gap-2">

          {/* sync button — auto-detects new hires */}
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={handleSync}
            disabled={actionLoading}
          >
            {actionLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <RefreshCw className="w-4 h-4" />}
            Sync New Hires
          </Button>

          {/* manual add dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" disabled={actionLoading}>
                <UserPlus className="w-4 h-4" />
                Add New Hire
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Start Employee Onboarding</DialogTitle>
                <DialogDescription>
                  Select a hired candidate. The agent will automatically
                  complete their full onboarding.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {pendingEmployees.length > 0 ? (
                  <div className="space-y-4">
                    <Label>Select Employee</Label>
                    <Select
                      value={selectedEmployeeId}
                      onValueChange={setSelectedEmployeeId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a candidate to onboard" />
                      </SelectTrigger>
                      <SelectContent>
                        {pendingEmployees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{emp.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {emp.role}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedEmployeeId && (() => {
                      const emp = pendingEmployees.find(e => e.id === selectedEmployeeId)
                      if (!emp) return null
                      return (
                        <div className="p-4 rounded-lg border border-border bg-secondary/30 space-y-2">
                          <h4 className="font-medium text-foreground">
                            Employee Details
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Name:</span>
                              <p className="text-foreground">{emp.name}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Role:</span>
                              <p className="text-foreground">{emp.role}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">Email:</span>
                              <p className="text-foreground">{emp.email}</p>
                            </div>
                          </div>
                          <div className="p-3 rounded bg-blue-500/10 border border-blue-500/20">
                            <p className="text-xs text-blue-600">
                              Agent will set up accounts, assign equipment,
                              schedule training, assign tasks, then send a
                              document request email. Welcome email is sent
                              automatically when candidate submits documents.
                            </p>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No pending candidates.</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      All hired candidates have been onboarded.
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false)
                    setSelectedEmployeeId("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartOnboarding}
                  disabled={!selectedEmployeeId || actionLoading}
                >
                  {actionLoading && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  Start Onboarding
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total onboarding", value: stats.total,         icon: UserPlus,    color: "bg-primary/10 text-primary" },
          { label: "In progress",      value: stats.inProgress,    icon: Clock,       color: "bg-yellow-500/10 text-yellow-500" },
          { label: "Completed",        value: stats.completed,     icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-500" },
          { label: "Avg. completion",  value: `${stats.avgRate}%`, icon: Users,       color: "bg-blue-500/10 text-blue-500" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* new hires list */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground text-base">New Hires</CardTitle>
            <CardDescription>Click to view onboarding details</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {newHires.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">
                No onboarding records yet. Click "Sync New Hires" or "Add New Hire".
              </p>
            ) : (
              <div className="divide-y divide-border">
                {newHires.map(hire => (
                  <button
                    key={hire.id}
                    onClick={() => setSelectedHire(hire)}
                    className={cn(
                      "w-full p-4 text-left transition-colors hover:bg-secondary/50",
                      selectedHire?.id === hire.id && "bg-secondary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {hire.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground text-sm">
                            {hire.name}
                          </p>
                          {hire.status === "completed" && (
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                          )}
                          {pollingRefs.current[hire.id] && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{hire.role}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {STATUS_MESSAGES[hire.onboardingStatus]?.message ?? hire.onboardingStatus}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-foreground font-medium">
                          {hire.progress}%
                        </span>
                      </div>
                      <Progress value={hire.progress} className="h-1.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* onboarding details */}
        {!selectedHire ? (
          <div className="xl:col-span-2 flex items-center justify-center text-muted-foreground text-sm">
            Select a new hire to view their onboarding details.
          </div>
        ) : (
          <div className="xl:col-span-2 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {selectedHire.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-foreground">
                        {selectedHire.name}
                      </CardTitle>
                      <CardDescription>{selectedHire.role}</CardDescription>
                      <p className="text-xs text-muted-foreground">
                        {selectedHire.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        selectedHire.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30"
                          : selectedHire.status === "in-progress"
                          ? "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {selectedHire.status === "completed" ? "Completed"
                        : selectedHire.status === "in-progress" ? "In Progress"
                        : "Pending"}
                    </Badge>
                    {pollingRefs.current[selectedHire.id] && (
                      <span className="text-xs text-blue-500 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Live updates on
                      </span>
                    )}
                  </div>
                </div>

                {/* current status message */}
                {selectedHire.onboardingStatus && (
                  <div className={cn(
                    "mt-3 p-3 rounded-lg border text-sm",
                    selectedHire.onboardingStatus === "completed"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700"
                      : selectedHire.onboardingStatus === "awaiting_documents"
                      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-700"
                      : selectedHire.onboardingStatus === "documents_received"
                      ? "bg-blue-500/10 border-blue-500/20 text-blue-700"
                      : "bg-secondary border-border text-muted-foreground"
                  )}>
                    {selectedHire.onboardingStatus === "awaiting_documents" && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>
                          Document request sent to {selectedHire.email}.
                          Waiting for candidate to submit via the form link in their email.
                        </span>
                      </div>
                    )}
                    {selectedHire.onboardingStatus === "documents_received" && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                        <span>Documents received! Sending welcome email...</span>
                      </div>
                    )}
                    {selectedHire.onboardingStatus === "completed" && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>
                          Onboarding complete. Welcome email sent to {selectedHire.email}.
                        </span>
                      </div>
                    )}
                    {!["awaiting_documents", "documents_received", "completed"].includes(
                      selectedHire.onboardingStatus
                    ) && (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                        <span>
                          {STATUS_MESSAGES[selectedHire.onboardingStatus]?.message
                            ?? "Agent is processing..."}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="text-foreground font-medium">
                      {selectedHire.progress}%
                    </span>
                  </div>
                  <Progress value={selectedHire.progress} className="h-2" />
                </div>

                {/* checklist */}
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Onboarding Checklist
                  <span className="ml-2 text-xs text-muted-foreground font-normal">
                    (managed automatically by agent)
                  </span>
                </h4>
                <div className="space-y-3">
                  {selectedHire.tasks.map(task => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border",
                        task.completed
                          ? "bg-emerald-500/10 border-emerald-500/20"
                          : "bg-secondary/30 border-border"
                      )}
                    >
                      <Checkbox checked={task.completed} disabled />
                      <span className={cn(
                        "text-sm flex-1",
                        task.completed
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      )}>
                        {task.title}
                      </span>
                      {task.completed
                        ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                        : <Clock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  ))}
                </div>

                {/* action buttons */}
                <div className="flex flex-wrap gap-3 mt-6">

                  {/* check documents button — shows when waiting */}
                  {selectedHire.onboardingStatus === "awaiting_documents" && (
                    <Button
                      variant="outline"
                      className="gap-2 bg-transparent"
                      onClick={handleCheckDocuments}
                      disabled={actionLoading}
                    >
                      {actionLoading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <FileText className="w-4 h-4" />}
                      Check Documents
                    </Button>
                  )}

                  {/* manual welcome email */}
                  
                </div>
              </CardContent>
            </Card>

            {/* workflow steps */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground text-base">
                  Onboarding Workflow
                </CardTitle>
                <CardDescription>
                  Steps completed automatically by the agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  {ONBOARDING_STEPS.map((step, index) => {
                    const isCompleted = selectedHire.tasks[index]?.completed ?? false
                    return (
                      <div key={step.title} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                            isCompleted
                              ? "bg-emerald-500/20 text-emerald-500"
                              : "bg-secondary text-muted-foreground"
                          )}>
                            <step.icon className="w-5 h-5" />
                          </div>
                          <p className="text-xs text-foreground font-medium text-center">
                            {step.title}
                          </p>
                        </div>
                        {index < ONBOARDING_STEPS.length - 1 && (
                          <div className={cn(
                            "w-12 h-0.5 mx-2",
                            isCompleted ? "bg-emerald-500" : "bg-border"
                          )} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}