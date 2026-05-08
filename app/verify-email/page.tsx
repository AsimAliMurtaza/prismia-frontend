"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { CheckCircle, AlertTriangle } from "lucide-react";

type StatusType = "verifying" | "success" | "error";

function VerifyEmailContent() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [status, setStatus] = useState<StatusType>("verifying");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    fetch("/api/auth/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl p-8 text-center space-y-6">
        {/* VERIFYING */}
        {status === "verifying" && (
          <>
            <div className="flex justify-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-lg font-semibold">Verifying Email</h2>
            <p className="text-sm text-muted-foreground">
              Please wait while we confirm your account.
            </p>
          </>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <>
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
            <h2 className="text-lg font-semibold">Email Verified</h2>
            <p className="text-sm text-muted-foreground">
              Redirecting you to login...
            </p>
          </>
        )}

        {/* ERROR */}
        {status === "error" && (
          <>
            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
            <h2 className="text-lg font-semibold">Verification Failed</h2>
            <p className="text-sm text-muted-foreground">
              The link is invalid or has expired.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
