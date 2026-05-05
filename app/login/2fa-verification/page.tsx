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
    } catch (err : any) {
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
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-md p-6 md:p-8">
        
        <div className="space-y-6">
          
          <h1 className="text-2xl font-semibold text-center text-teal-400">
            Verify Your Account
          </h1>

          <p className="text-center text-zinc-400">
            Enter the 6-digit code sent to{" "}
            <span className="text-teal-400 font-medium">{email}</span>
          </p>

          {/* OTP Input */}
          <input
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
            }}
            type="text"
            inputMode="numeric"
            placeholder="ــــــ"
            className="w-full text-center text-xl tracking-[1rem] py-3 rounded-full bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
          />

          {/* Button */}
          <button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="w-full py-2 rounded-full bg-teal-500 hover:bg-teal-600 disabled:opacity-50 transition"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </button>

          {/* Resend */}
          <div className="text-center text-sm text-zinc-400">
            Didn&apos;t receive a code?{" "}
            <span className="text-teal-400 cursor-pointer hover:underline">
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
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Loading verification...
        </div>
      }
    >
      <TwoFAVerificationContent />
    </Suspense>
  );
}