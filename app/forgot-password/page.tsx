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

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      toast({
        title: res.ok ? "Success" : "Error",
        description: data.message,
        variant: res.ok ? "default" : "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-background text-foreground px-4 transition-colors"
    >
      <div className="w-full max-w-md relative">
        {/* Card */}
        <div
          className="mt-10 rounded-2xl border border-border 
          bg-card shadow-xl p-6 sm:p-8 transition-colors"
        >
          {/* Header */}
          <h1 className="text-2xl font-semibold text-center">
            Forgot Password
          </h1>

          <p className="text-sm text-muted-foreground text-center mt-2 mb-6">
            Enter your email and we’ll send you a reset link.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm text-muted-foreground">
                Email address
              </label>

              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 rounded-lg
                  bg-secondary text-foreground
                  border border-border
                  focus:outline-none focus:ring-2 focus:ring-primary
                  transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg
                bg-primary text-primary-foreground
                hover:opacity-90 transition
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-xs text-center mt-8 text-muted-foreground">
            © {new Date().getFullYear()} Prismia. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
