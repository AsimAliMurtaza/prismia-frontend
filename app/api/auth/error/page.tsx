"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaArrowLeft, FaHome } from "react-icons/fa";

const MotionDiv = motion.div;

export default function SignInErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <MotionDiv
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-zinc-900 rounded-2xl shadow-lg p-8 text-center">
          
          <div className="flex flex-col items-center gap-6">
            
            {/* Icon */}
            <div className="p-4 rounded-full bg-red-900/40">
              <FaExclamationTriangle className="text-red-400 text-3xl" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold">
              Sign-In Error
            </h1>

            {/* Message */}
            <p className="text-zinc-400 text-sm leading-relaxed">
              Oops! We couldn’t sign you in. Please check your credentials and try again.
            </p>

            {/* Buttons */}
            <div className="w-full space-y-3 pt-4">
              
              <button
                onClick={() => router.push("/login")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-teal-500 hover:bg-teal-600 transition"
              >
                <FaArrowLeft />
                Back to Login
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-zinc-600 hover:bg-zinc-800 transition"
              >
                <FaHome />
                Go to Home
              </button>

            </div>
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}