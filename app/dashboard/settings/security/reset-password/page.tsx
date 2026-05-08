"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useState, useEffect, Suspense, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const extractToken = useCallback(() => {
    const foundToken = searchParams.get("token");
    if (foundToken) setToken(foundToken);
  }, [searchParams]);

  useEffect(() => {
    extractToken();
  }, [extractToken]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Error",
        description: "Invalid reset link",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Password updated",
          description: "Redirecting to login...",
        });

        setTimeout(() => router.push("/login"), 1500);
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-xl p-6 sm:p-8">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Enter a strong new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Password */}
            <div>
              <label className="text-sm text-muted-foreground">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-lg
                  bg-secondary text-foreground
                  border border-border
                  focus:outline-none focus:ring-2 focus:ring-primary
                  transition"
              />
            </div>

            {/* Confirm */}
            <div>
              <label className="text-sm text-muted-foreground">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-lg
                  bg-secondary text-foreground
                  border border-border
                  focus:outline-none focus:ring-2 focus:ring-primary
                  transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg
                bg-primary text-primary-foreground
                hover:opacity-90 transition
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-center mt-6 text-muted-foreground">
            © {new Date().getFullYear()} Prismia. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }
  >
    <ResetPasswordContent />
  </Suspense>
);

export default ResetPasswordPage;