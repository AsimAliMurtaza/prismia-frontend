"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Search,
  Sparkles,
  Plus,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  RefreshCw,
  Mail,
  Briefcase,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

import { Trash2, Power, PowerOff } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface Job {
  _id: string
  jd_id: string
  title: string
  description: string
  required_skills: string[]
  min_experience_years: number
  education_requirement: string
  is_active: boolean
  created_at: string
}

interface Screening {
  _id: string
  candidate_name: string
  candidate_email: string
  job_title: string
  jd_id: string
  final_score: number
  status: "shortlisted" | "rejected" | "invalid_application"
  skill_score: number
  experience_score: number
  education_score: number
  semantic_similarity_score: number
  llm_feedback: string
  evaluation_breakdown: {
    matched_skills: string[]
    missing_skills: string[]
    experience_gap: number
    education_match: boolean
  }
  created_at: string
}

// ─────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────

const statusConfig = {
  shortlisted: {
    label: "Shortlisted",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  invalid_application: {
    label: "Invalid",
    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export function ResumeScreening() {
  const [activeTab, setActiveTab] = useState("screenings")
  const [screenings, setScreenings] = useState<Screening[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterJobId, setFilterJobId] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Upload resume state
  const [uploadJobId, setUploadJobId] = useState("")
  const [uploadEmail, setUploadEmail] = useState("")
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Gmail screening state
  const [gmailJobId, setGmailJobId] = useState("")
  const [gmailLoading, setGmailLoading] = useState(false)
  const [gmailResult, setGmailResult] = useState<any | null>(null)
  const [gmailError, setGmailError] = useState<string | null>(null)

  // Create job state
  const [jobDialogOpen, setJobDialogOpen] = useState(false)
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    required_skills: "",
    min_experience_years: "",
    education_requirement: "",
  })
  const [jobFile, setJobFile] = useState<File | null>(null)
  const [jobLoading, setJobLoading] = useState(false)
  const [createdJob, setCreatedJob] = useState<{ jd_id: string; title: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const jobFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchJobs()
    fetchScreenings()
  }, [])

  async function fetchJobs() {
    try {
      const res = await fetch(`${API_BASE}/resume-screening/jobs/`)
      if (!res.ok) throw new Error("Failed to fetch jobs")
      const data = await res.json()
      setJobs(data)
    } catch (e: any) {
      console.error("fetchJobs error:", e)
    }
  }

  async function fetchScreenings() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filterJobId && filterJobId !== "all") params.append("job_id", filterJobId)
      if (filterStatus && filterStatus !== "all") params.append("status", filterStatus)
      const res = await fetch(`${API_BASE}/resume-screening/screenings/?${params}`)
      if (!res.ok) throw new Error("Failed to fetch screenings")
      const data = await res.json()
      setScreenings(data)
      if (data.length > 0 && !selectedScreening) setSelectedScreening(data[0])
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchScreenings() }, [filterJobId, filterStatus])

  // ── Upload Resume ───────────────────────
  async function handleUploadResume() {
    if (!uploadFile || !uploadJobId) return
    setUploadLoading(true)
    setUploadResult(null)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("job_id", uploadJobId)
      formData.append("sender_email", uploadEmail)
      formData.append("file", uploadFile)
      const res = await fetch(`${API_BASE}/resume-screening/screenings/upload`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Upload failed")
      }
      const result = await res.json()
      setUploadResult(result)
      setUploadFile(null)
      setUploadEmail("")
      if (fileInputRef.current) fileInputRef.current.value = ""
      await fetchScreenings()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploadLoading(false)
    }
  }

  // ── Gmail Screening ─────────────────────
  async function handleGmailScreen() {
  setGmailLoading(true)
  setGmailResult(null)
  setGmailError(null)
  try {
    const res = await fetch(`${API_BASE}/resume-screening/screenings/gmail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),   // empty body, job_id extracted from email subject
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || "Gmail screening failed")
    }
    const result = await res.json()
    setGmailResult(result)
    await fetchScreenings()
  } catch (e: any) {
    setGmailError(e.message)
  } finally {
    setGmailLoading(false)
  }
}

  // ── Create Job ──────────────────────────
  async function handleCreateJob() {
    setJobLoading(true)
    setError(null)
    try {
      let res: Response
      if (jobFile) {
        // PDF/DOCX upload — description comes from file
        const formData = new FormData()
        //formData.append("title", jobForm.title)
        //formData.append("required_skills", jobForm.required_skills)
        //formData.append("min_experience_years", jobForm.min_experience_years)
        //formData.append("education_requirement", jobForm.education_requirement || "Bachelor")
        //formData.append("file", jobFile)

        if (jobForm.title) formData.append("title", jobForm.title)
        if (jobForm.required_skills) formData.append("required_skills", jobForm.required_skills)
        if (jobForm.min_experience_years) formData.append("min_experience_years", jobForm.min_experience_years)
        if (jobForm.education_requirement) formData.append("education_requirement", jobForm.education_requirement)

        formData.append("file", jobFile)


        res = await fetch(`${API_BASE}/resume-screening/jobs/upload`, {
          method: "POST",
          body: formData,
        })
      } else {
        // Text form
        const skills = jobForm.required_skills.split(",").map((s) => s.trim()).filter(Boolean)
        res = await fetch(`${API_BASE}/resume-screening/jobs/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: jobForm.title,
            description: jobForm.description,
            required_skills: skills,
            min_experience_years: parseFloat(jobForm.min_experience_years),
            education_requirement: jobForm.education_requirement || "Bachelor",
          }),
        })
      }
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Failed to create job")
      }
      const data = await res.json()
      setCreatedJob({ jd_id: data.jd_id, title: data.title })
      setJobForm({ title: "", description: "", required_skills: "", min_experience_years: "", education_requirement: "" })
      setJobFile(null)
      await fetchJobs()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setJobLoading(false)
    }
  }

  // ── Button enabled logic ─────────────────
  // For PDF upload: need title + skills + experience + file
  // For text form:  need title + skills + experience + description
  // FIXED — check file first, then validate required fields

  // claude logic
  //const hasRequiredFields = !!jobForm.title && !!jobForm.required_skills && !!jobForm.min_experience_years
  //const hasDescription = jobFile ? true : !!jobForm.description.trim()
  //const canCreateJob = !jobLoading && hasRequiredFields && hasDescription

  const isUploadMode = !!jobFile

  const canCreateJob = !jobLoading && (
    isUploadMode
      ? true
      : (
          !!jobForm.title &&
          !!jobForm.required_skills &&
          !!jobForm.min_experience_years &&
          !!jobForm.description.trim()
        )
  )

  function handleCopyJdId() {
    if (!createdJob) return
    navigator.clipboard.writeText(createdJob.jd_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredScreenings = screenings.filter(
    (s) =>
      s.candidate_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.candidate_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.job_title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Resume Screening</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { fetchJobs(); fetchScreenings() }} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>

          {/* Create Job Dialog */}
          <Dialog open={jobDialogOpen} onOpenChange={(open) => {
            setJobDialogOpen(open)
            if (!open) { setCreatedJob(null); setError(null) }
          }}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job Description</DialogTitle>
                <DialogDescription>
                  Fill in details manually or upload a PDF/DOCX file. A unique JD_ID is generated automatically.
                </DialogDescription>
              </DialogHeader>

              {createdJob ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="font-medium text-foreground">Job Created — {createdJob.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Share this ID with candidates. They must include it in their email subject line.
                    </p>
                    <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                      <code className="text-lg font-bold text-primary flex-1">{createdJob.jd_id}</code>
                      <Button size="sm" variant="ghost" onClick={handleCopyJdId} className="gap-1">
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Email subject format: <code className="text-primary">Application {createdJob.jd_id}</code>
                    </p>
                  </div>
                  <Button className="w-full" onClick={() => { setCreatedJob(null); setJobDialogOpen(false) }}>
                    Done
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Title */}
                  <div className="space-y-1">
                    <Label>Job Title *</Label>
                    <Input
                      placeholder="e.g. Senior Python Developer"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    />
                  </div>

                  {/* Skills */}
                  <div className="space-y-1">
                    <Label>Required Skills * (comma separated)</Label>
                    <Input
                      placeholder="Python, FastAPI, MongoDB, Docker"
                      value={jobForm.required_skills}
                      onChange={(e) => setJobForm({ ...jobForm, required_skills: e.target.value })}
                    />
                  </div>

                  {/* Experience + Education */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label>Min Experience (years) *</Label>
                      <Input
                        type="number"
                        placeholder="4"
                        value={jobForm.min_experience_years}
                        onChange={(e) => setJobForm({ ...jobForm, min_experience_years: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Education Required</Label>
                      <Input
                        placeholder="Bachelor"
                        value={jobForm.education_requirement}
                        onChange={(e) => setJobForm({ ...jobForm, education_requirement: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* File upload OR text description */}
                  <div className="space-y-1">
                    <Label>Upload JD File (PDF/DOCX)</Label>
                    <div
                      className="border border-dashed border-border rounded-lg p-3 text-center cursor-pointer hover:bg-secondary/30 transition-colors"
                      onClick={() => jobFileRef.current?.click()}
                    >
                      {jobFile ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-foreground">
                          <FileText className="w-4 h-4 text-primary" />
                          {jobFile.name}
                          <button
                            onClick={(e) => { e.stopPropagation(); setJobFile(null) }}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Click to browse PDF or DOCX — description will be extracted automatically
                        </span>
                      )}
                    </div>
                    <input
                      ref={jobFileRef}
                      type="file"
                      accept=".pdf,.docx,.doc"
                      className="hidden"
                      onChange={(e) => {
                        setJobFile(e.target.files?.[0] || null)
                        // Clear typed description when file selected
                        if (e.target.files?.[0]) setJobForm(f => ({ ...f, description: "" }))
                      }}
                    />
                  </div>

                  {/* Text description — only shown when no file selected */}
                  {!jobFile && (
                    <div className="space-y-1">
                      <Label>
                        Job Description *
                        <span className="text-xs text-muted-foreground ml-1">(required if no file uploaded)</span>
                      </Label>
                      <Textarea
                        placeholder="Paste full job description here..."
                        className="h-28 resize-none"
                        value={jobForm.description}
                        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                      />
                    </div>
                  )}

                  {/* File selected confirmation */}
                  {jobFile && (
                    <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 rounded-lg px-3 py-2">
                      <CheckCircle className="w-4 h-4" />
                      Description will be extracted from <span className="font-medium">{jobFile.name}</span>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={handleCreateJob}
                    disabled={!canCreateJob}
                  >
                    {jobLoading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Job...</>
                    ) : (
                      "Create Job & Generate JD_ID"
                    )}
                  </Button>

                  {/* Helper text for disabled state */}
                  {!canCreateJob && !jobLoading && (
                    <p className="text-xs text-muted-foreground text-center">
                      {!jobForm.title ? "Enter job title" :
                        !jobForm.required_skills ? "Enter required skills" :
                          !jobForm.min_experience_years ? "Enter min experience years" :
                            !jobFile && !jobForm.description ? "Upload a PDF file or paste job description" :
                              ""}
                    </p>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Main Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="screenings" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Screenings
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Resume
          </TabsTrigger>
          <TabsTrigger value="gmail" className="gap-2">
            <Mail className="w-4 h-4" />
            Gmail Screening
          </TabsTrigger>
          <TabsTrigger value="jobs" className="gap-2">
            <Briefcase className="w-4 h-4" />
            All Jobs
            {jobs.length > 0 && (
              <Badge variant="outline" className="ml-1 text-xs px-1.5 py-0">{jobs.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════════
            TAB 1: Screenings
        ══════════════════════════════════════ */}
        <TabsContent value="screenings" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* List */}
            <div className="xl:col-span-1">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-base">Screened Candidates</CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search candidates..."
                      className="pl-9 bg-secondary border-border"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Select value={filterJobId} onValueChange={setFilterJobId}>
                      <SelectTrigger className="bg-secondary border-border text-xs h-8">
                        <SelectValue placeholder="All Jobs" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Jobs</SelectItem>
                        {jobs.map((job) => (
                          <SelectItem key={job._id} value={job._id}>
                            {job.jd_id} — {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="bg-secondary border-border text-xs h-8">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="invalid_application">Invalid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex items-center justify-center py-8 text-muted-foreground">
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />Loading...
                    </div>
                  ) : filteredScreenings.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">No screenings found.</div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredScreenings.map((s) => (
                        <button
                          key={s._id}
                          onClick={() => setSelectedScreening(s)}
                          className={cn(
                            "w-full p-4 text-left transition-colors hover:bg-secondary/50",
                            selectedScreening?._id === s._id && "bg-secondary"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-foreground text-sm truncate pr-2">
                              {s.candidate_name}
                            </span>
                            <Badge variant="outline" className={cn("text-xs shrink-0", statusConfig[s.status]?.color)}>
                              {statusConfig[s.status]?.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">{s.job_title}</p>
                          <p className="text-xs font-mono text-primary mb-2">{s.jd_id}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={cn("h-full rounded-full",
                                  (s.final_score ?? 0) >= 75 ? "bg-emerald-500"
                                    : (s.final_score ?? 0) >= 50 ? "bg-yellow-500" : "bg-red-500"
                                )}
                                style={{ width: `${s.final_score ?? 0}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-foreground">{s.final_score ?? 0}%</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Detail */}
            <div className="xl:col-span-2">
              {!selectedScreening ? (
                <Card className="bg-card border-border h-full flex items-center justify-center min-h-64">
                  <div className="text-center text-muted-foreground py-16">
                    <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Select a candidate to view details</p>
                  </div>
                </Card>
              ) : (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-foreground">{selectedScreening.candidate_name}</CardTitle>
                        <CardDescription>{selectedScreening.candidate_email}</CardDescription>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedScreening.job_title}
                          <span className="font-mono text-primary ml-2">{selectedScreening.jd_id}</span>
                        </p>
                      </div>
                      <Badge variant="outline" className={statusConfig[selectedScreening.status]?.color}>
                        {statusConfig[selectedScreening.status]?.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Score */}
                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">AI Match Score</span>
                      </div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl font-bold text-foreground">{selectedScreening.final_score ?? 0}%</div>
                        <div className="flex-1">
                          <Progress value={selectedScreening.final_score ?? 0} className="h-3" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: "Skills Match", value: selectedScreening.skill_score, weight: "40%" },
                          { label: "Experience", value: selectedScreening.experience_score, weight: "25%" },
                          { label: "Education", value: selectedScreening.education_score, weight: "15%" },
                          { label: "Semantic Relevance", value: selectedScreening.semantic_similarity_score, weight: "20%" },
                        ].map((item) => (
                          <div key={item.label} className="p-2 rounded bg-secondary/50">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{item.label}</span>
                              <span className="text-muted-foreground">{item.weight}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full",
                                    (item.value ?? 0) >= 75 ? "bg-emerald-500"
                                      : (item.value ?? 0) >= 50 ? "bg-yellow-500" : "bg-red-500"
                                  )}
                                  style={{ width: `${item.value ?? 0}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-foreground w-8 text-right">
                                {item.value ?? 0}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Skills */}
                    {selectedScreening.evaluation_breakdown && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Matched Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedScreening.evaluation_breakdown.matched_skills?.length > 0
                              ? selectedScreening.evaluation_breakdown.matched_skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">{skill}</Badge>
                              ))
                              : <span className="text-xs text-muted-foreground">None</span>}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-2">Missing Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {selectedScreening.evaluation_breakdown.missing_skills?.length > 0
                              ? selectedScreening.evaluation_breakdown.missing_skills.map((skill) => (
                                <Badge key={skill} variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">{skill}</Badge>
                              ))
                              : <span className="text-xs text-muted-foreground">None</span>}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Extra info */}
                    {selectedScreening.evaluation_breakdown && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <p className="text-xs text-muted-foreground mb-1">Experience Gap</p>
                          <p className="text-sm font-medium text-foreground">
                            {selectedScreening.evaluation_breakdown.experience_gap > 0
                              ? `${selectedScreening.evaluation_breakdown.experience_gap} years short`
                              : "Meets requirement"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <p className="text-xs text-muted-foreground mb-1">Education Match</p>
                          <p className="text-sm font-medium text-foreground">
                            {selectedScreening.evaluation_breakdown.education_match ? "✅ Meets requirement" : "❌ Does not meet"}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {selectedScreening.llm_feedback && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">AI Feedback</h4>
                        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                          <p className="text-sm text-muted-foreground leading-relaxed">{selectedScreening.llm_feedback}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════
            TAB 2: Upload Resume
        ══════════════════════════════════════ */}
        <TabsContent value="upload" className="mt-4">
          <Card className="bg-card border-border max-w-2xl">
            <CardHeader>
              <CardTitle className="text-foreground text-base">Screen a Resume (HR Upload)</CardTitle>
              <CardDescription>
                Select a job, optionally enter candidate email, then upload their resume PDF or DOCX.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label>Select Job *</Label>
                <Select value={uploadJobId} onValueChange={setUploadJobId}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Choose a job to screen against..." />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job._id} value={job._id}>
                        <span className="font-mono text-primary text-xs mr-2">{job.jd_id}</span>
                        {job.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Candidate Email (optional)</Label>
                <Input
                  placeholder="candidate@email.com"
                  value={uploadEmail}
                  onChange={(e) => setUploadEmail(e.target.value)}
                  className="bg-secondary border-border"
                />
              </div>

              <div className="space-y-1">
                <Label>Resume File * (PDF or DOCX)</Label>
                <div
                  className="flex items-center gap-2 border border-dashed border-border rounded-md px-4 py-6 cursor-pointer hover:bg-secondary/50 transition-colors justify-center"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadFile ? (
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{uploadFile.name}</p>
                        <p className="text-xs text-muted-foreground">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); setUploadFile(null) }}
                        className="ml-4 text-muted-foreground hover:text-destructive"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOCX supported</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept=".pdf,.docx,.doc" className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4" />{error}
                </div>
              )}

              <Button
                className="w-full gap-2"
                onClick={handleUploadResume}
                disabled={uploadLoading || !uploadFile || !uploadJobId}
              >
                {uploadLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Screening in progress...</>
                  : <><Sparkles className="w-4 h-4" />Screen Resume</>}
              </Button>

              {/* Result */}
              {uploadResult && (
                <div className={cn(
                  "p-4 rounded-lg border space-y-2",
                  uploadResult.status === "shortlisted"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-red-500/10 border-red-500/20"
                )}>
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    {uploadResult.status === "shortlisted"
                      ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                      : <XCircle className="w-5 h-5 text-red-400" />}
                    {uploadResult.status === "shortlisted" ? "Shortlisted ✅" : "Rejected ❌"}
                    <span className="ml-auto text-lg font-bold">{uploadResult.final_score}/100</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[
                      { label: "Skills", value: uploadResult.skill_score },
                      { label: "Experience", value: uploadResult.experience_score },
                      { label: "Education", value: uploadResult.education_score },
                      { label: "Semantic", value: uploadResult.semantic_similarity_score },
                    ].map(item => (
                      <div key={item.label} className="text-center bg-secondary/50 rounded p-2">
                        <p className="text-muted-foreground mb-0.5">{item.label}</p>
                        <p className="font-bold text-foreground">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{uploadResult.llm_feedback}</p>
                  <Button size="sm" variant="outline" className="w-full gap-2" onClick={() => setActiveTab("screenings")}>
                    <ChevronRight className="w-4 h-4" />View in Screenings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════
            TAB 3: Gmail Screening
        ══════════════════════════════════════ */}
        <TabsContent value="gmail" className="mt-4">
          <Card className="bg-card border-border max-w-2xl">
            <CardHeader>
              <CardTitle className="text-foreground text-base flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Gmail Resume Screening
              </CardTitle>
              <CardDescription>
                Fetches the latest unread Gmail email with a PDF/DOCX attachment.
                The email subject must contain the Job ID (e.g. <code className="text-primary">Application JD_X7K2P</code>).
                If no Job ID is found in the subject, the application is automatically rejected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* How it works */}
              <div className="p-3 rounded-lg bg-secondary/50 border border-border space-y-2">
                <p className="text-xs font-medium text-foreground">How it works:</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>1. Candidate emails resume to your Gmail with subject containing the Job ID</p>
                  <p>2. Click "Fetch & Screen" below</p>
                  <p>3. System reads latest unread email, extracts Job ID from subject</p>
                  <p>4. Screens resume against matched job automatically</p>
                  <p>5. Email is marked as read after processing</p>
                </div>
              </div>

              {/* Job IDs reference */}
              {jobs.length > 0 && (
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Active Job IDs to share with candidates:</Label>
                  <div className="flex flex-wrap gap-2">
                    {jobs.map((job) => (
                      <div key={job._id} className="flex items-center gap-1.5 bg-secondary rounded-md px-2 py-1">
                        <code className="text-xs font-bold text-primary">{job.jd_id}</code>
                        <span className="text-xs text-muted-foreground">— {job.title}</span>
                        <button
                          onClick={() => { navigator.clipboard.writeText(job.jd_id) }}
                          className="text-muted-foreground hover:text-foreground ml-1"
                          title="Copy JD_ID"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Email format example */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Candidate email format:</p>
                <p className="text-xs font-medium text-foreground">To: your-gmail@gmail.com</p>
                <p className="text-xs font-medium text-foreground">
                  Subject: <span className="text-primary">Application {jobs[0]?.jd_id || "JD_XXXXX"}</span>
                </p>
                <p className="text-xs text-muted-foreground">Attachment: resume.pdf</p>
              </div>

              {gmailError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4" />{gmailError}
                </div>
              )}

              <Button
                className="w-full gap-2"
                onClick={handleGmailScreen}
                disabled={gmailLoading}
              >
                {gmailLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" />Fetching from Gmail...</>
                  : <><Mail className="w-4 h-4" />Fetch & Screen Latest Email</>}
              </Button>

              {/* Gmail result */}
              {gmailResult && (
                <div className={cn(
                  "p-4 rounded-lg border space-y-2",
                  gmailResult.status === "shortlisted"
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : gmailResult.status === "invalid_application"
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : "bg-red-500/10 border-red-500/20"
                )}>
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    {gmailResult.status === "shortlisted"
                      ? <CheckCircle className="w-5 h-5 text-emerald-400" />
                      : gmailResult.status === "invalid_application"
                        ? <AlertCircle className="w-5 h-5 text-yellow-400" />
                        : <XCircle className="w-5 h-5 text-red-400" />}
                    {gmailResult.status === "shortlisted" ? "Shortlisted ✅"
                      : gmailResult.status === "invalid_application" ? "Invalid Application ⚠️"
                        : "Rejected ❌"}
                    {gmailResult.final_score !== undefined && (
                      <span className="ml-auto text-lg font-bold">{gmailResult.final_score}/100</span>
                    )}
                  </div>
                  {gmailResult.sender_email && (
                    <p className="text-xs text-muted-foreground">From: {gmailResult.sender_email}</p>
                  )}
                  {gmailResult.llm_feedback && (
                    <p className="text-xs text-muted-foreground leading-relaxed">{gmailResult.llm_feedback}</p>
                  )}
                  <Button size="sm" variant="outline" className="w-full gap-2" onClick={() => setActiveTab("screenings")}>
                    <ChevronRight className="w-4 h-4" />View in Screenings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ══════════════════════════════════════
            TAB 4: All Jobs
        ══════════════════════════════════════ */}
        <TabsContent value="jobs" className="mt-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Jobs List */}
            <div className="xl:col-span-1">
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-foreground text-base">
                    Posted Jobs
                    <Badge variant="outline" className="ml-2 text-xs">{jobs.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {jobs.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No jobs posted yet. Click "Post New Job" to add one.
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {jobs.map((job) => (
                        <button
                          key={job._id}
                          onClick={() => setSelectedJob(job)}
                          className={cn(
                            "w-full p-4 text-left transition-colors hover:bg-secondary/50",
                            selectedJob?._id === job._id && "bg-secondary"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-foreground text-sm truncate pr-2">{job.title}</span>
                            <Badge variant="outline" className={cn("text-xs shrink-0",
                              job.is_active
                                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                : "bg-secondary text-muted-foreground"
                            )}>
                              {job.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <code className="text-xs text-primary font-bold">{job.jd_id}</code>
                          <p className="text-xs text-muted-foreground mt-1">
                            {job.min_experience_years}y exp · {job.education_requirement}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {job.required_skills.slice(0, 3).map((skill) => (
                              <span key={skill} className="text-xs bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">
                                {skill}
                              </span>
                            ))}
                            {job.required_skills.length > 3 && (
                              <span className="text-xs text-muted-foreground">+{job.required_skills.length - 3} more</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Job Detail */}
            <div className="xl:col-span-2">
              {!selectedJob ? (
                <Card className="bg-card border-border h-full flex items-center justify-center min-h-64">
                  <div className="text-center text-muted-foreground py-16">
                    <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Select a job to view details</p>
                  </div>
                </Card>
              ) : (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-foreground">{selectedJob.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-primary font-bold text-sm">{selectedJob.jd_id}</code>
                          <button
                            onClick={() => navigator.clipboard.writeText(selectedJob.jd_id)}
                            className="text-muted-foreground hover:text-foreground"
                            title="Copy JD_ID"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <Badge variant="outline" className={
                        selectedJob.is_active
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-secondary text-muted-foreground"
                      }>
                        {selectedJob.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <p className="text-xs text-muted-foreground mb-1">Min Experience</p>
                        <p className="text-sm font-medium text-foreground">{selectedJob.min_experience_years} years</p>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <p className="text-xs text-muted-foreground mb-1">Education Required</p>
                        <p className="text-sm font-medium text-foreground">{selectedJob.education_requirement || "Not specified"}</p>
                      </div>
                    </div>

                    {/* Required Skills */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Required Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedJob.required_skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Share section */}
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <h4 className="text-sm font-medium text-foreground mb-2">Share with Candidates</h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        Candidates must include the Job ID in their email subject:
                      </p>
                      <div className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                        <code className="text-sm text-primary flex-1">Application {selectedJob.jd_id}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 gap-1"
                          onClick={() => navigator.clipboard.writeText(`Application ${selectedJob.jd_id}`)}
                        >
                          <Copy className="w-3 h-3" />Copy
                        </Button>
                      </div>
                    </div>

                    {/* Description preview */}
                    {selectedJob.description && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Job Description</h4>
                        <div className="p-3 rounded-lg bg-secondary/30 border border-border max-h-48 overflow-y-auto">
                          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                            {selectedJob.description.slice(0, 800)}
                            {selectedJob.description.length > 800 && "..."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Screen against this job button */}
                    <Button
                      className="w-full gap-2"
                      variant="outline"
                      onClick={() => {
                        setUploadJobId(selectedJob._id)
                        setActiveTab("upload")
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      Screen a Resume Against This Job
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
