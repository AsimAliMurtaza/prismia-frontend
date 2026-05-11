"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Loader2, FileText } from "lucide-react"

const BASE = "http://localhost:8000/onboarding"

export default function SubmitDocumentsPage() {
  const params = useParams()
  const candidate_id = params.candidate_id as string

  const [pageData, setPageData]     = useState<any>(null)
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [message, setMessage]       = useState("")
  const [error, setError]           = useState("")

  const [form, setForm] = useState({
    nda_signed: false,
    cnic_number: "",           // ← only CNIC now
  })

  useEffect(() => {
    fetch(`${BASE}/submit-documents/${candidate_id}`)
      .then(r => r.json())
      .then(data => {
        setPageData(data)
        if (data.already_submitted) setSubmitted(true)
      })
      .catch(() => setError("Failed to load form. Please try again."))
      .finally(() => setLoading(false))
  }, [candidate_id])

  const handleSubmit = async () => {
    if (!form.nda_signed) {
      setError("Please agree to the NDA before submitting.")
      return
    }
    if (!form.cnic_number.trim()) {
      setError("Please enter your CNIC number.")
      return
    }
    // basic CNIC format validation: 13 digits or XXXXX-XXXXXXX-X
    const cnicClean = form.cnic_number.replace(/-/g, "")
    if (cnicClean.length !== 13 || !/^\d+$/.test(cnicClean)) {
      setError("Please enter a valid CNIC number (13 digits).")
      return
    }

    setError("")
    setSubmitting(true)
    try {
      const res = await fetch(`${BASE}/submit-documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id,
          nda_signed: form.nda_signed,
          cnic_number: form.cnic_number.trim(),
        }),
      }).then(r => r.json())

      setMessage(res.message)
      setSubmitted(true)
    } catch {
      setError("Submission failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Documents Submitted!
            </h2>
            <p className="text-muted-foreground">
              {message || "Thank you! You will receive a welcome email shortly."}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Submit Your Documents</CardTitle>
              <CardDescription>
                Welcome, {pageData?.full_name} — {pageData?.job_role}
              </CardDescription>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Please complete the form below to proceed with your onboarding.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* NDA */}
          <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-secondary/30">
            <Checkbox
              id="nda"
              checked={form.nda_signed}
              onCheckedChange={checked =>
                setForm(f => ({ ...f, nda_signed: !!checked }))
              }
            />
            <div>
              <Label htmlFor="nda" className="cursor-pointer font-medium">
                I agree to the Non-Disclosure Agreement (NDA)
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                By checking this you confirm you have read and agreed to Prismia's NDA.
              </p>
            </div>
          </div>

          {/* CNIC */}
          <div className="space-y-2">
            <Label htmlFor="cnic">CNIC Number</Label>
            <Input
              id="cnic"
              placeholder="e.g. 35202-1234567-1"
              value={form.cnic_number}
              onChange={e => setForm(f => ({ ...f, cnic_number: e.target.value }))}
              maxLength={15}
            />
            <p className="text-xs text-muted-foreground">
              Enter your 13-digit CNIC number (with or without dashes).
            </p>
          </div>

          {/* error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Documents"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}