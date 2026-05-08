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
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing token");
      return;
    }

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
        title: "Account Unblocked",
        description: "Redirecting to login...",
      });

      setTimeout(() => router.push("/login"), 2500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong");

      toast({
        title: "Error",
        description: err.message || "Unblock failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <Unlock className="w-10 h-10 text-primary" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold">Unblock Your Account</h1>

        {/* Description */}
        <p className="text-sm text-muted-foreground">
          We detected unusual activity. You can safely restore access below.
        </p>

        {/* Button / Loader / Status */}
        {status === "idle" && (
          <button
            onClick={handleUnblock}
            className="w-full py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Unblock Account
          </button>
        )}

        {status === "loading" && (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {status === "success" && (
          <p className="text-green-500 font-medium">{message}</p>
        )}

        {status === "error" && (
          <p className="text-red-500 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

export default function UnblockAccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <UnblockAccountContent />
    </Suspense>
  );
}
