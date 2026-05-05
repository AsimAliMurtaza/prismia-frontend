"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setLoading(false);

    toast({
      title: res.ok ? "Success" : "Error",
      description: data.message,
      variant: res.ok ? "default" : "destructive",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-6">
        
        <h1 className="text-2xl font-semibold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-sm text-zinc-400 text-center mb-6">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="text-sm text-zinc-400">Email address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-teal-500 hover:bg-teal-600 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-xs text-center mt-8 text-zinc-500">
          © {new Date().getFullYear()} Cognivia. All rights reserved.
        </p>
      </div>
    </div>
  );
}