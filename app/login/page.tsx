"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import { ThemeToggle } from "@/components/ui/themeToggle";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [is2FARequired] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

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
      console.error(err);
      toast({
        title: "Login failed",
        description: "Check your credentials or network",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300">
      <div className="w-full max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg bg-card border border-border">

            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-10">
              <ThemeToggle />
            </div>

            {/* LEFT SIDE */}
            <div className="flex-1 p-8 flex flex-col justify-center items-center text-center">
              <h1 className="text-4xl font-thin">Prismia</h1>
              <p className="text-sm text-muted-foreground mt-2">
                Sign in to continue
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1 p-8 space-y-4">
              <h2 className="text-lg font-semibold">
                Sign in to your account
              </h2>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full mt-1 px-4 py-2 rounded-full bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-sm text-muted-foreground">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full mt-1 px-4 py-2 rounded-full bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* OTP */}
              {is2FARequired && (
                <div>
                  <label className="text-sm text-muted-foreground">
                    2FA Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full mt-1 px-4 py-2 rounded-full bg-input border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              )}

              {/* LOGIN */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                {loading ? "Loading..." : "Login"}
              </button>

              {/* FORGOT */}
              <p
                onClick={() => router.push("/forgot-password")}
                className="text-sm text-primary text-center cursor-pointer hover:underline"
              >
                Forgot password?
              </p>

              <div className="border-t border-border my-4" />

              {/* OAUTH */}
              <div className="space-y-3">
                <button
                  onClick={() =>
                    signIn("google", { callbackUrl: "/dashboard" })
                  }
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-border hover:bg-accent transition"
                >
                  <FcGoogle />
                  Continue with Google
                </button>

                <button
                  onClick={() =>
                    signIn("github", { callbackUrl: "/dashboard" })
                  }
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-border hover:bg-accent transition"
                >
                  <FaGithub />
                  Continue with GitHub
                </button>
              </div>

              {/* SIGNUP */}
              <p className="text-sm text-center mt-6 text-muted-foreground">
                Don&apos;t have an account?{" "}
                <span
                  onClick={() => router.push("/signup")}
                  className="text-primary cursor-pointer hover:underline"
                >
                  Create one
                </span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}