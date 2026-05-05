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
      setLoading(false);

      if (res.ok) {
        toast({
          title: "Success",
          description: data.message,
        });

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err : any) {
      console.error("Reset password error:", err);
      setLoading(false);
      toast({
        title: "Error",
        description: "Unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-6">
        
        <h1 className="text-2xl font-semibold text-center mb-2">
          Reset Your Password
        </h1>

        <p className="text-sm text-zinc-400 text-center mb-6">
          Enter and confirm your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Password */}
          <div>
            <label className="text-sm text-zinc-400">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Confirm */}
          <div>
            <label className="text-sm text-zinc-400">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-teal-500 hover:bg-teal-600 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>

        <p className="text-xs text-center mt-8 text-zinc-500">
          © {new Date().getFullYear()} Cognivia. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => (
  <Suspense
    fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="w-10 h-10 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-zinc-400">Loading reset form...</p>
      </div>
    }
  >
    <ResetPasswordContent />
  </Suspense>
);

export default ResetPasswordPage;