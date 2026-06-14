"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Video, Users, ArrowRight } from "lucide-react";
import { setRoleAction } from "../actions/onboarding";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const { update } = useSession();
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectRole = async (role: "streamer" | "viewer") => {
    setLoadingRole(role);
    setErrorMsg(null);
    try {
      // 1. Update the database securely
      await setRoleAction(role);
      
      // 2. Refresh the NextAuth JWT cookie seamlessly on the client side
      await update({ role });

      // 3. Redirect to their specific dashboard based on role
      if (role === "streamer") {
        router.push("/dashboard/creator");
      } else {
        router.push("/discover");
      }
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || "An error occurred");
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Choose your path</h1>
        <p className="text-foreground/50 text-lg">Are you here to broadcast or to watch?</p>
        {errorMsg && (
          <p className="text-red-500 mt-4 bg-red-500/10 p-3 rounded-lg border border-red-500/20">{errorMsg}</p>
        )}
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl z-10">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectRole("streamer")}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          }}
          disabled={!!loadingRole}
          className={`flex-1 relative group overflow-hidden rounded-3xl p-1 text-left cursor-pointer ${loadingRole === "streamer" ? 'opacity-50' : ''}`}
        >
          {/* Spotlight Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
               style={{ background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(239,68,68,0.15), transparent 40%)' }} />
               
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <div className="relative h-full bg-background/60 backdrop-blur-xl border border-foreground/10 p-8 rounded-[1.4rem] flex flex-col gap-4 z-20 transition-all group-hover:border-red-500/50">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-red-500/30">
              {loadingRole === "streamer" ? (
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Video className="w-8 h-8 text-red-500" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">I'm a Streamer</h2>
              <p className="text-sm text-foreground/50">I want to broadcast my camera and screen with zero latency.</p>
            </div>
            <div className="mt-auto pt-4 flex items-center gap-2 text-red-400 font-medium text-sm group-hover:gap-3 transition-all">
              Enter Studio <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSelectRole("viewer")}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
            e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
          }}
          disabled={!!loadingRole}
          className={`flex-1 relative group overflow-hidden rounded-3xl p-1 text-left cursor-pointer ${loadingRole === "viewer" ? 'opacity-50' : ''}`}
        >
          {/* Spotlight Effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
               style={{ background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59,130,246,0.15), transparent 40%)' }} />
               
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
          <div className="relative h-full bg-background/60 backdrop-blur-xl border border-foreground/10 p-8 rounded-[1.4rem] flex flex-col gap-4 z-20 transition-all group-hover:border-blue-500/50">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-blue-500/30">
              {loadingRole === "viewer" ? (
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Users className="w-8 h-8 text-blue-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">I'm a Viewer</h2>
              <p className="text-sm text-foreground/50">I want to watch live streams, chat, and participate in polls.</p>
            </div>
            <div className="mt-auto pt-4 flex items-center gap-2 text-blue-400 font-medium text-sm group-hover:gap-3 transition-all">
              Explore Streams <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
