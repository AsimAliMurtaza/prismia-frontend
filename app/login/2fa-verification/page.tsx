"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

function TwoFAVerificationContent() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleVerify = async () => {
    if (!email) {
      toast({ title: "Session expired", variant: "destructive" });
      router.push("/login");
      return;
    }

    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Enter a 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const verifyRes = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        throw new Error(err.error || "OTP verification failed");
      }

      const signInResult = await signIn("credentials", {
        email,
        otp,
        password: "__OTP__",
        redirect: false,
        callbackUrl,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      router.push(signInResult?.url || callbackUrl);

      toast({ title: "Login successful" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Verification failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-background text-foreground px-4 transition-colors">

      <div className="w-full max-w-md relative">

        {/* Card */}
        <div className="mt-10 rounded-2xl border border-border 
          bg-card shadow-xl p-6 sm:p-8 transition-colors">

          {/* Header */}
          <h1 className="text-2xl font-semibold text-center">
            Verify Your Account
          </h1>

          <p className="text-center text-sm text-muted-foreground mt-2">
            Enter the 6-digit code sent to{" "}
            <span className="text-primary font-medium">{email}</span>
          </p>

          {/* OTP Input */}
          <div className="mt-6">
            <input
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setOtp(value);
              }}
              type="text"
              inputMode="numeric"
              placeholder="------"
              className="w-full text-center text-xl tracking-[0.8rem]
                py-3 rounded-xl
                bg-secondary text-foreground
                border border-border
                focus:outline-none focus:ring-2 focus:ring-primary
                transition"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="w-full mt-5 py-2.5 rounded-lg
              bg-primary text-primary-foreground
              hover:opacity-90 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          {/* Resend */}
          <div className="text-center text-sm text-muted-foreground mt-5">
            Didn&rsquo;t receive a code?{" "}
            <span className="text-primary cursor-pointer hover:underline">
              Resend Code
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TwoFAVerification() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center 
          bg-background text-foreground">
          Loading verification...
        </div>
      }
    >
      <TwoFAVerificationContent />
    </Suspense>
  );
}