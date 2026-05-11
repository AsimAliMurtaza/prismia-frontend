"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  Video,
  Plus,
  ChevronLeft,
  ChevronRight,
  Users,
  Send,
  Loader2,
  Mail,
  ExternalLink,
  X,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  fetchInterviews,
  suggestDecision,
  submitFeedback,
  type Interview,
} from "@/lib/interviews-api";

function formatTimeSlot(scheduledAt: string): string {
  if (!scheduledAt) return "";
  const date = new Date(scheduledAt);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(scheduledAt: string): string {
  if (!scheduledAt) return "";
  return new Date(scheduledAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getWeekDays() {
  const today = new Date();
  const days = [];
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  for (let i = 0; i < 5; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    days.push({
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.getDate().toString(),
      isToday: d.toDateString() === today.toDateString(),
    });
  }
  return days;
}

// ── Candidate Info Panel (for scheduled interviews only) ──────────
function CandidatePanel({
  interview,
  onClose,
}: {
  interview: Interview;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Candidate Info</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/20 text-primary text-lg">
                {interview.candidate_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {interview.candidate_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {interview.job_title}
              </p>
              <Badge className="mt-1 text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                {interview.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 p-4 rounded-lg bg-secondary/30 border border-border">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">
                {interview.candidate_email || "No email"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Briefcase className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{interview.job_title}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">
                {formatDate(interview.scheduled_at)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">
                {formatTimeSlot(interview.scheduled_at)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">
                {interview.interviewer_email}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Video className="w-4 h-4 text-muted-foreground shrink-0" />
              {interview.meet_link ? (
                <a
                  href={interview.meet_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Join Meeting <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-muted-foreground">No link</span>
              )}
            </div>
          </div>

          {/* Email status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">
              Invitation email sent
            </span>
          </div>

          {/* Join Meet button */}
          {interview.meet_link && (
            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => window.open(interview.meet_link, "_blank")}
            >
              <Video className="w-4 h-4" />
              Join Google Meet
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Feedback Already Submitted Panel ─────────────────────────────
function FeedbackSubmittedPanel({
  interview,
  onClose,
}: {
  interview: Interview;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-500/20 flex items-center justify-center mx-auto">
            <span className="text-3xl">✓</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground">
            Feedback Already Submitted
          </h3>
          <p className="text-sm text-muted-foreground">
            Feedback for <strong>{interview.candidate_name}</strong> has already
            been recorded.
          </p>
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Feedback Form ─────────────────────────────────────────────────
function FeedbackForm({
  interview,
  onClose,
  onSuccess,
}: {
  interview: Interview;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    technicalScore: 5,
    communicationScore: 5,
    culturalFitScore: 5,
    strengths: "",
    weaknesses: "",
  });
  const [step, setStep] = useState<"form" | "submitting" | "done">("form");
  const [result, setResult] = useState<{
    decision: string;
    reasoning: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.strengths || !form.weaknesses) {
      setError("Please fill in strengths and weaknesses");
      return;
    }
    setError("");
    setStep("submitting");
    try {
      const suggestion = await suggestDecision(
        interview.id,
        form.technicalScore,
        form.communicationScore,
        form.culturalFitScore,
        form.strengths,
        form.weaknesses,
      );
      await submitFeedback(
        interview.id,
        form.technicalScore,
        form.communicationScore,
        form.culturalFitScore,
        form.strengths,
        form.weaknesses,
        suggestion.decision,
        suggestion.reasoning,
      );
      setResult({
        decision: suggestion.decision,
        reasoning: suggestion.reasoning,
      });
      setStep("done");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
      setStep("form");
    }
  };

  const ScoreInput = ({
    label,
    field,
  }: {
    label: string;
    field: keyof typeof form;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm text-foreground">{label}</Label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={10}
          value={form[field] as number}
          onChange={(e) =>
            setForm((f) => ({ ...f, [field]: Number(e.target.value) }))
          }
          className="flex-1 accent-primary"
        />
        <span className="w-8 text-center font-semibold">{form[field]}/10</span>
      </div>
    </div>
  );

  if (step === "done" && result) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardContent className="pt-8 pb-8 text-center space-y-5">
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl",
                result.decision === "hired"
                  ? "bg-emerald-500/20"
                  : result.decision === "rejected"
                    ? "bg-red-500/20"
                    : "bg-yellow-500/20",
              )}
            >
              {result.decision === "hired"
                ? "✓"
                : result.decision === "rejected"
                  ? "✕"
                  : "~"}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                Decision Made
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                for <strong>{interview.candidate_name}</strong>
              </p>
            </div>
            <Badge
              className={cn(
                "text-base px-6 py-2",
                result.decision === "hired"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                  : result.decision === "rejected"
                    ? "bg-red-500/20 text-red-400 border-red-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
              )}
            >
              {result.decision.replace("_", " ").toUpperCase()}
            </Badge>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border text-left">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Reasoning
              </p>
              <p className="text-sm text-foreground">{result.reasoning}</p>
            </div>
            <Button
              onClick={() => {
                onSuccess();
              }}
              className="w-full"
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground">
                Interview Feedback
              </CardTitle>
              <CardDescription>
                {interview.candidate_name} — {interview.job_title}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Scores</h4>
            <ScoreInput label="Technical Score" field="technicalScore" />
            <ScoreInput
              label="Communication Score"
              field="communicationScore"
            />
            <ScoreInput label="Cultural Fit Score" field="culturalFitScore" />
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">
              Qualitative Feedback
            </h4>
            <div className="space-y-2">
              <Label>Strengths</Label>
              <Textarea
                placeholder="What did the candidate do well?"
                value={form.strengths}
                onChange={(e) =>
                  setForm((f) => ({ ...f, strengths: e.target.value }))
                }
                className="bg-secondary/30 border-border"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Weaknesses</Label>
              <Textarea
                placeholder="Areas where the candidate needs improvement"
                value={form.weaknesses}
                onChange={(e) =>
                  setForm((f) => ({ ...f, weaknesses: e.target.value }))
                }
                className="bg-secondary/30 border-border"
                rows={3}
              />
            </div>
          </div>
          <Button
            className="w-full gap-2"
            onClick={handleSubmit}
            disabled={step === "submitting"}
          >
            {step === "submitting" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing & Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Feedback
              </>
            )}
          </Button>
          {step === "submitting" && (
            <p className="text-xs text-center text-muted-foreground">
              AI is analyzing interview data and generating a decision...
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────
export function InterviewScheduler() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 16; // adjust (8–12 works well for grid)
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(
    null,
  );
  const [feedbackInterview, setFeedbackInterview] = useState<Interview | null>(
    null,
  );
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState<Set<string>>(
    new Set(),
  );
  const [alreadySubmitted, setAlreadySubmitted] = useState<Interview | null>(
    null,
  );
  const weekDays = getWeekDays();

  useEffect(() => {
    setSelectedDate(new Date().getDate().toString());
    loadInterviews();
  }, []);

  const paginatedInterviews = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return interviews.slice(start, start + pageSize);
  }, [interviews, currentPage]);
  const totalPages = Math.ceil(interviews.length / pageSize);
  const loadInterviews = async () => {
    setLoading(true);
    try {
      const data = await fetchInterviews();
      setInterviews(data);

      // Check which completed interviews already have feedback
      const completed = data.filter((i) => i.status === "completed");
      const feedbackChecks = await Promise.all(
        completed.map(async (i) => {
          const res = await fetch(`/api/hr/interviews/${i.id}/feedback`);
          return { id: i.id, hasFeedback: res.status === 200 };
        }),
      );
      const submitted = new Set(
        feedbackChecks.filter((f) => f.hasFeedback).map((f) => f.id),
      );
      setSubmittedFeedbacks(submitted);
    } catch (e) {
      console.error("Failed to load interviews:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleInterviewClick = (interview: Interview) => {
    if (interview.status === "completed") {
      if (submittedFeedbacks.has(interview.id)) {
        setAlreadySubmitted(interview);
      } else {
        setFeedbackInterview(interview);
      }
    } else {
      setSelectedInterview(interview);
    }
  };

  const todayInterviews = interviews.filter((i) => {
    if (!i.scheduled_at) return false;
    const d = new Date(i.scheduled_at);
    const selected = weekDays.find((w) => w.date === selectedDate);
    if (!selected) return false;
    return (
      d.getDate().toString() === selectedDate &&
      d.getMonth() === new Date().getMonth() &&
      d.getFullYear() === new Date().getFullYear()
    );
  });

  const getInterviewForSlot = (slot: string) =>
    todayInterviews.find((i) => formatTimeSlot(i.scheduled_at) === slot);

  return (
    <div className="space-y-6">
      {/* Candidate Info Panel — scheduled interviews */}
      {selectedInterview && (
        <CandidatePanel
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
        />
      )}

      {/* Feedback Form — completed interviews without feedback */}
      {feedbackInterview && (
        <FeedbackForm
          interview={feedbackInterview}
          onClose={() => setFeedbackInterview(null)}
          onSuccess={() => {
            setSubmittedFeedbacks((prev) =>
              new Set(prev).add(feedbackInterview!.id),
            );
            setFeedbackInterview(null);
            loadInterviews();
          }}
        />
      )}

      {/* Already Submitted Panel */}
      {alreadySubmitted && (
        <FeedbackSubmittedPanel
          interview={alreadySubmitted}
          onClose={() => setAlreadySubmitted(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Interview Schedule
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage and schedule candidate interviews
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Schedule Interview
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Interviews */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <Card className="bg-card border-border col-span-full">
              <CardHeader>
                <CardTitle className="text-foreground text-base">
                  Upcoming Interviews
                </CardTitle>
                <CardDescription>
                  {interviews.length} total interviews
                </CardDescription>
              </CardHeader>
            </Card>

            {interviews.length === 0 ? (
              <div className="col-span-full">
                <p className="text-sm text-muted-foreground text-center py-4">
                  No interviews scheduled
                </p>
              </div>
            ) : (
              paginatedInterviews.map((interview) => (
                <div
                  key={interview.id}
                  onClick={() => handleInterviewClick(interview)}
                  className="p-3 rounded-lg bg-secondary/30 border border-border transition-colors cursor-pointer hover:border-primary/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-foreground text-xs">
                        {interview.candidate_name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {interview.candidate_name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {interview.job_title}
                      </p>
                    </div>

                    <Badge
                      className={cn(
                        "text-xs shrink-0",
                        interview.status === "completed"
                          ? submittedFeedbacks.has(interview.id)
                            ? "bg-gray-500/20 text-gray-400 border-gray-500/30"
                            : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-blue-500/20 text-blue-400 border-blue-500/30",
                      )}
                    >
                      {interview.status === "completed"
                        ? submittedFeedbacks.has(interview.id)
                          ? "Done"
                          : "Feedback"
                        : interview.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(interview.scheduled_at)}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTimeSlot(interview.scheduled_at)}
                    </span>
                  </div>
                </div>
              ))
            )}
            <div className="flex items-center justify-between pt-4">
              <p className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
