"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [is2FARequired] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) throw new Error(result.error);

      if (result?.ok) {
        if (result.url?.includes("2fa-verification")) {
          router.push(result.url);
          return;
        }

        router.push("/redirect");

        toast({
          title: "Login successful",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Login failed",
        description: "Check your connection or credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg bg-zinc-900">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-700 transition"
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>

            {/* Left */}
            <div className="flex-1 p-8 flex flex-col justify-center items-center text-center">
              <h1 className="text-4xl font-thin mb-4">Prismia</h1>
              <p className="text-sm text-zinc-400">Sign in to continue</p>
            </div>

            {/* Right */}
            <div className="flex-1 p-8">
              <h2 className="text-lg font-semibold mb-6">
                Sign in to your account
              </h2>

              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="text-sm text-zinc-400">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full mt-1 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-sm text-zinc-400">Password</label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full mt-1 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* OTP */}
                {is2FARequired && (
                  <div>
                    <label className="text-sm text-zinc-400">2FA Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full mt-1 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Login */}
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-2 rounded-full bg-teal-500 hover:bg-teal-600 transition text-white"
                >
                  {loading ? "Loading..." : "Login"}
                </button>

                {/* Forgot */}
                <p
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm text-blue-400 text-center cursor-pointer hover:underline"
                >
                  Forgot password?
                </p>

                <div className="border-t border-zinc-700 my-4" />

                {/* OAuth */}
                <div className="space-y-3">
                  <button
                    onClick={() =>
                      signIn("google", { callbackUrl: "/dashboard" })
                    }
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-zinc-600 hover:bg-zinc-800"
                  >
                    <FcGoogle />
                    Continue with Google
                  </button>

                  <button
                    onClick={() =>
                      signIn("github", { callbackUrl: "/dashboard" })
                    }
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-zinc-600 hover:bg-zinc-800"
                  >
                    <FaGithub />
                    Continue with GitHub
                  </button>
                </div>

                {/* Signup */}
                <p className="text-sm text-center mt-6 text-zinc-400">
                  Don&apos;t have an account?{" "}
                  <span
                    onClick={() => router.push("/signup")}
                    className="text-blue-400 cursor-pointer hover:underline"
                  >
                    Create one
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
