"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { useState } from "react";
import { loginWithGithub, loginWithCredentials, registerWithCredentials } from "@/app/actions/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    try {
      if (isSignUp) {
        await registerWithCredentials(formData);
      } else {
        await loginWithCredentials(formData);
      }
    } catch (err: any) {
      // NextAuth throws NEXT_REDIRECT errors which are totally normal.
      // We MUST rethrow them so the Next.js router can catch and execute the redirect!
      if (err.message === "NEXT_REDIRECT" || (err.digest && err.digest.includes("NEXT_REDIRECT"))) {
        throw err;
      }
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background text-foreground">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, -50, 0] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] right-[5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* Back Button */}
      <Link href="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-white/5 rounded-[2rem] blur-xl opacity-50" />
        <div className="relative bg-background/80 backdrop-blur-2xl border border-foreground/10 p-10 rounded-[2rem] shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 border border-primary/30 shadow-[0_0_20px_rgba(157,78,221,0.2)]">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="text-foreground/50 text-sm">
              {isSignUp ? "Sign up to start broadcasting instantly." : "Enter your credentials to access the studio."}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground/70 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input 
                  type="email" 
                  name="email"
                  placeholder="you@example.com" 
                  required
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:bg-foreground/10 transition-all placeholder:text-foreground/30"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-medium text-foreground/70">Password</label>
                {!isSignUp && <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">Forgot?</Link>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input 
                  type="password" 
                  name="password"
                  placeholder="••••••••" 
                  required
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary focus:bg-foreground/10 transition-all placeholder:text-foreground/30"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full relative group overflow-hidden rounded-xl mt-6 p-[1px] cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-background/80 backdrop-blur-md px-4 py-3 rounded-xl flex items-center justify-center font-semibold transition-all group-hover:bg-transparent">
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-foreground/30 border-t-white rounded-full" />
                ) : (
                  isSignUp ? "Sign Up Free" : "Sign In to Studio"
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-foreground/10"></div></div>
            <div className="relative flex justify-center text-xs"><span className="bg-[#0b0b0b] px-4 text-foreground/40">Or continue with</span></div>
          </div>

          <div className="mt-6 flex gap-3">
            <button 
              type="button"
              onClick={() => loginWithGithub()}
              className="flex-1 flex items-center justify-center gap-2 bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 rounded-xl py-2.5 text-sm font-medium transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              GitHub
            </button>
          </div>
          
          <div className="mt-8 text-center text-xs text-foreground/40">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="ml-1 text-primary hover:text-foreground transition-colors cursor-pointer"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
