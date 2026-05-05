"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Unlock } from "lucide-react";

function UnblockAccountContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const router = useRouter();
  const { toast } = useToast();

  const handleUnblock = async () => {
    setStatus("loading");

    try {
      const res = await fetch("/api/account/unblock", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus("success");
      setMessage(data.message);

      toast({
        title: "Account Unblocked!",
        description: "Redirecting to login...",
      });

      setTimeout(() => router.push("/login"), 3000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errMsg = err.message || "Something went wrong";
      setStatus("error");
      setMessage(errMsg);

      toast({
        title: "Error",
        description: errMsg,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl p-8 text-center">
        
        <div className="flex flex-col items-center gap-6">
          
          {/* Icon */}
          <Unlock className="w-8 h-8 text-teal-400" />

          {/* Heading */}
          <h1 className="text-2xl font-semibold">
            Unblock Your Cognivia Account
          </h1>

          {/* Description */}
          <p className="text-zinc-400">
            We detected unusual activity on your account. Click below to
            securely restore access.
          </p>

          {/* Actions */}
          {status === "idle" && (
            <button
              onClick={handleUnblock}
              className="px-6 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 transition"
            >
              Unblock My Account
            </button>
          )}

          {status === "loading" && (
            <div className="w-8 h-8 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
          )}

          {(status === "success" || status === "error") && (
            <p
              className={`font-medium ${
                status === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default function UnblockAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
          <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading Unblock Page...</p>
        </div>
      }
    >
      <UnblockAccountContent />
    </Suspense>
  );
}