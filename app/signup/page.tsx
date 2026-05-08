"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowLeft, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "next-themes";
import { useToast } from "@/components/ui/use-toast";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignup = async () => {
    if (!email || !password) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      toast({
        title: "Account created!",
        description:
          "Verify your account by clicking on the email link sent to you.",
      });
      router.push("/login");
    } else {
      setError("Signup failed! Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="bg-card text-card-foreground rounded-2xl shadow-lg p-8 border border-border">
          
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="text-primary hover:opacity-80 text-sm flex items-center mb-4"
          >
            <FiArrowLeft className="mr-2 text-xl" />
          </button>

          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Left */}
            <div className="flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-thin mb-4">Prismia</h1>
              <p className="text-muted-foreground text-sm">
                Create an account to get started.
              </p>
            </div>

            {/* Right */}
            <div className="space-y-5">
              
              {/* Theme Toggle */}
              <div className="flex justify-end">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-muted transition"
                >
                  {theme === "dark" ? <FiSun /> : <FiMoon />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <h2 className="text-lg font-semibold">
                Create your account
              </h2>

              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="space-y-5 mt-4">
                    
                    {/* Email */}
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mt-1 px-4 py-2 rounded-full bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <label className="text-sm text-muted-foreground">
                        Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mt-1 px-4 py-2 rounded-full bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      onClick={handleSignup}
                      disabled={loading}
                      className="w-full py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition"
                    >
                      {loading ? "Creating..." : "Sign Up"}
                    </button>

                    <div className="border-t border-border" />

                    {/* Login */}
                    <p className="text-sm text-center text-muted-foreground">
                      Already have an account?{" "}
                      <span
                        onClick={() => router.push("/login")}
                        className="text-primary cursor-pointer hover:underline"
                      >
                        Log in
                      </span>
                    </p>

                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}