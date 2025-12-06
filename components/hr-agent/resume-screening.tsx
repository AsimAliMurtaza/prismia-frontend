"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, XCircle, Clock, Search, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const resumes = [
  {
    id: 1,
    name: "John Smith",
    role: "Senior Software Engineer",
    email: "john.smith@email.com",
    score: 92,
    status: "qualified",
    skills: ["React", "TypeScript", "Node.js", "AWS"],
    experience: "8 years",
    uploadedAt: "2 hours ago",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    role: "Product Manager",
    email: "sarah.j@email.com",
    score: 85,
    status: "qualified",
    skills: ["Agile", "Roadmapping", "Analytics", "Leadership"],
    experience: "6 years",
    uploadedAt: "3 hours ago",
  },
  {
    id: 3,
    name: "Mike Chen",
    role: "Data Scientist",
    email: "mike.chen@email.com",
    score: 78,
    status: "review",
    skills: ["Python", "ML", "TensorFlow", "SQL"],
    experience: "4 years",
    uploadedAt: "5 hours ago",
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "UX Designer",
    email: "emily.d@email.com",
    score: 45,
    status: "rejected",
    skills: ["Figma", "User Research"],
    experience: "2 years",
    uploadedAt: "6 hours ago",
  },
  {
    id: 5,
    name: "Tom Wilson",
    role: "Marketing Manager",
    email: "tom.w@email.com",
    score: 88,
    status: "qualified",
    skills: ["SEO", "Content Strategy", "Analytics", "Campaign Management"],
    experience: "7 years",
    uploadedAt: "8 hours ago",
  },
]

const statusConfig = {
  qualified: { label: "Qualified", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  review: { label: "Under Review", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  rejected: { label: "Not Qualified", color: "bg-red-500/20 text-red-400 border-red-500/30" },
}

export function ResumeScreening() {
  const [selectedResume, setSelectedResume] = useState(resumes[0])
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="bg-card border-border border-dashed">
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Upload Resumes for Screening</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Drag and drop resume files here, or click to browse. Supports PDF, DOC, DOCX formats.
            </p>
            <Button className="gap-2">
              <Upload className="w-4 h-4" />
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Resume List */}
        <div className="xl:col-span-1">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-foreground text-base">Screened Resumes</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-9 bg-secondary border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {resumes
                  .filter(
                    (r) =>
                      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      r.role.toLowerCase().includes(searchQuery.toLowerCase()),
                  )
                  .map((resume) => (
                    <button
                      key={resume.id}
                      onClick={() => setSelectedResume(resume)}
                      className={cn(
                        "w-full p-4 text-left transition-colors hover:bg-secondary/50",
                        selectedResume.id === resume.id && "bg-secondary",
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground text-sm">{resume.name}</span>
                        <Badge
                          variant="outline"
                          className={statusConfig[resume.status as keyof typeof statusConfig].color}
                        >
                          {statusConfig[resume.status as keyof typeof statusConfig].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{resume.role}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              resume.score >= 80
                                ? "bg-emerald-500"
                                : resume.score >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500",
                            )}
                            style={{ width: `${resume.score}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">{resume.score}%</span>
                      </div>
                    </button>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resume Details */}
        <div className="xl:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-foreground">{selectedResume.name}</CardTitle>
                  <CardDescription>{selectedResume.role}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={statusConfig[selectedResume.status as keyof typeof statusConfig].color}
                >
                  {statusConfig[selectedResume.status as keyof typeof statusConfig].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Score */}
              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">AI Match Score</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-foreground">{selectedResume.score}%</div>
                  <div className="flex-1">
                    <Progress value={selectedResume.score} className="h-3" />
                  </div>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm text-foreground">{selectedResume.email}</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Experience</p>
                  <p className="text-sm text-foreground">{selectedResume.experience}</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Matched Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedResume.skills.map((skill) => (
                    <Badge key={skill} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Analysis */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">AI Analysis</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Strong Technical Background</p>
                      <p className="text-xs text-muted-foreground">
                        Candidate has extensive experience with required technologies
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Leadership Experience</p>
                      <p className="text-xs text-muted-foreground">Previously led teams of 5+ engineers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Industry Transition</p>
                      <p className="text-xs text-muted-foreground">
                        Moving from fintech to SaaS - may need adjustment period
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <Button className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Move to Interview
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <FileText className="w-4 h-4" />
                  View Full Resume
                </Button>
                <Button variant="ghost" className="gap-2 text-destructive hover:text-destructive">
                  <XCircle className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
