"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionDiv = motion.div;

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  interface SessionData {
    userEmail: string;
    productPlan: string;
    amount: number;
    currency: string;
    status: string;
    creditsAdded?: number;
    subscriptionPeriod?: string;
  }

  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const res = await fetch(
          `/api/stripe/checkout/success?session_id=${sessionId}`
        );
        if (!res.ok) throw new Error();
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) fetchSessionData();
  }, [sessionId]);

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-white">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg text-zinc-400">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black text-white">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-zinc-900 rounded-3xl shadow-xl border border-zinc-700 overflow-hidden">
          
          {/* Header */}
          <div className="bg-blue-500 py-4 px-6 flex items-center justify-center gap-3">
            <span className="text-white text-2xl">✔</span>
            <h2 className="text-lg font-semibold text-white">
              Payment Successful!
            </h2>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            
            <p className="text-center text-zinc-300 mb-6">
              Thank you for your purchase,{" "}
              <span className="font-semibold text-white">
                {data?.userEmail}
              </span>
              . Your account has been updated.
            </p>

            {/* Details */}
            <div className="bg-blue-900/30 border border-zinc-700 p-6 rounded-xl space-y-4 mb-6">
              
              <div className="flex justify-between">
                <span className="text-zinc-400">Product:</span>
                <span className="font-semibold">{data?.productPlan}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-400">Amount:</span>
                <span className="font-semibold">
                  ${data?.amount ? (data.amount / 100).toFixed(2) : "0.00"}{" "}
                  {data?.currency?.toUpperCase()}
                </span>
              </div>

              {data?.creditsAdded && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Credits Added:</span>
                  <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md text-sm">
                    +{data.creditsAdded}
                  </span>
                </div>
              )}

              {data?.subscriptionPeriod && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subscription:</span>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md text-sm">
                    {data.subscriptionPeriod}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span
                  className={`px-2 py-1 rounded-md text-sm ${
                    data?.status === "complete"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {data?.status}
                </span>
              </div>
            </div>

            <div className="border-t border-zinc-700 my-6" />

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              
              <button
                onClick={handleDashboardClick}
                className="px-6 py-2 rounded-full bg-blue-500 hover:bg-blue-600 transition shadow-md hover:-translate-y-0.5"
              >
                Go to Dashboard
              </button>

              <Link href="/dashboard/transactions">
                <button className="px-6 py-2 rounded-full border border-zinc-600 hover:bg-zinc-800 transition hover:-translate-y-0.5">
                  View Transactions
                </button>
              </Link>

            </div>
          </div>
        </div>

        {/* Help */}
        <p className="mt-8 text-center text-sm text-zinc-400">
          Need help?{" "}
          <Link href="/support">
            <span className="text-blue-400 hover:underline cursor-pointer">
              Contact our support team
            </span>
          </Link>
        </p>
      </MotionDiv>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400">Loading your payment details...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}