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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const res = await fetch(
          `/api/stripe/checkout/success?session_id=${sessionId}`
        );
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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-background text-foreground">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background text-foreground">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-card border border-border rounded-3xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-primary text-primary-foreground py-4 px-6 flex items-center justify-center gap-3">
            <span className="text-xl">✔</span>
            <h2 className="font-semibold">Payment Successful</h2>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8 space-y-6">
            
            <p className="text-center text-muted-foreground">
              Thank you,{" "}
              <span className="font-medium text-foreground">
                {data?.userEmail}
              </span>
              . Your account has been updated.
            </p>

            {/* Details */}
            <div className="bg-muted/40 border border-border rounded-xl p-5 space-y-4">
              
              <Row label="Product" value={data?.productPlan} />
              
              <Row
                label="Amount"
                value={`$${(data?.amount / 100).toFixed(2)} ${data?.currency?.toUpperCase()}`}
              />

              {data?.creditsAdded && (
                <Row
                  label="Credits"
                  value={`+${data.creditsAdded}`}
                  highlight="success"
                />
              )}

              {data?.subscriptionPeriod && (
                <Row
                  label="Subscription"
                  value={data.subscriptionPeriod}
                  highlight="info"
                />
              )}

              <Row
                label="Status"
                value={data?.status}
                highlight={data?.status === "complete" ? "success" : "warning"}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                Go to Dashboard
              </button>

              <Link href="/dashboard/transactions">
                <button className="px-6 py-2 rounded-full border border-border hover:bg-muted transition">
                  View Transactions
                </button>
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Need help?{" "}
          <Link href="/support" className="text-primary hover:underline">
            Contact support
          </Link>
        </p>
      </MotionDiv>
    </div>
  );
}

/* Small reusable row */
function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value?: string;
  highlight?: "success" | "warning" | "info";
}) {
  const color =
    highlight === "success"
      ? "text-green-500"
      : highlight === "warning"
      ? "text-yellow-500"
      : highlight === "info"
      ? "text-blue-500"
      : "text-foreground";

  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-medium ${color}`}>{value}</span>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}