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
    if (token) {
      fetch("/api/auth/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus("success");
            setTimeout(() => router.push("/login"), 2500);
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl shadow-xl p-8 text-center">
        
        <div className="flex flex-col items-center gap-6">
          
          {status === "verifying" && (
            <>
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <h2 className="text-lg font-semibold">Verifying Email...</h2>
              <p className="text-zinc-400">
                Please wait while we verify your email.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-10 h-10 text-green-400" />
              <h2 className="text-lg font-semibold">Email Verified!</h2>
              <p className="text-zinc-400">
                Redirecting to login page...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <AlertTriangle className="w-10 h-10 text-red-400" />
              <h2 className="text-lg font-semibold">
                Verification Failed
              </h2>
              <p className="text-zinc-400">
                Invalid or expired token. Please try again.
              </p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
          <div className="w-full max-w-sm bg-zinc-900 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-zinc-400">Loading verification...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}