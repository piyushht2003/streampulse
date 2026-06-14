"use client";

import { motion } from "framer-motion";
import { useState, ReactNode } from "react";
import { LayoutPanelLeft, MessageSquare, BarChart3, Users } from "lucide-react";

interface StreamLayoutProps {
  videoArea: ReactNode;
  chatArea?: ReactNode;
  pollsArea?: ReactNode;
  telemetryArea?: ReactNode;
}

export const StreamLayout = ({ videoArea, chatArea, pollsArea, telemetryArea }: StreamLayoutProps) => {
  const [activeSidebar, setActiveSidebar] = useState<"chat" | "polls" | "none">("none");

  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    setIsRecording(true);
    try {
      await fetch('/api/record', {
        method: 'POST',
        body: JSON.stringify({ roomName: "stream-pulse-demo-1" })
      });
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col relative bg-background text-foreground">
      {/* Top Navbar */}
      <header className="h-16 border-b border-foreground/10 flex items-center justify-between px-6 z-10 glass-panel absolute top-0 left-0 w-full">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          <h1 className="font-bold text-lg tracking-tight">StreamPulse <span className="text-muted-foreground font-normal">Dashboard</span></h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={startRecording}
            disabled={isRecording}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              isRecording 
              ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse" 
              : "bg-foreground/5 text-foreground border-foreground/10 hover:bg-foreground/10"
            }`}
          >
            {isRecording ? "Recording Live" : "Start Recording"}
          </button>
          
          <div className="flex bg-foreground/5 rounded-lg p-1 border border-foreground/10">
            <button 
              onClick={() => setActiveSidebar(activeSidebar === "chat" ? "none" : "chat")}
              className={`p-2 rounded-md transition-colors ${activeSidebar === "chat" ? "bg-foreground/20 text-foreground" : "text-gray-400 hover:text-foreground"}`}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveSidebar(activeSidebar === "polls" ? "none" : "polls")}
              className={`p-2 rounded-md transition-colors ${activeSidebar === "polls" ? "bg-foreground/20 text-foreground" : "text-gray-400 hover:text-foreground"}`}
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 flex pt-16 h-full relative p-4 gap-4">
        
        {/* Telemetry Overlay floating on the left */}
        <div className="absolute left-8 top-20 z-30">
          {telemetryArea}
        </div>

        {/* Video Area (Antigravity Layout transition) */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          className="relative rounded-2xl overflow-hidden flex-1 border border-foreground/10 bg-background/80 shadow-2xl flex flex-col"
          style={{
            flex: activeSidebar === "none" ? "1 1 100%" : "1 1 calc(100% - 380px)",
            maxWidth: activeSidebar === "none" ? "100%" : "calc(100% - 380px)"
          }}
        >
          {videoArea}
        </motion.div>

        {/* Right Sidebar (Antigravity Layout transition) */}
        <motion.div
          layout
          initial={{ opacity: 0, x: 20, width: 0 }}
          animate={{ 
            opacity: activeSidebar !== "none" ? 1 : 0, 
            width: activeSidebar !== "none" ? 380 : 0,
            x: activeSidebar !== "none" ? 0 : 20
          }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          className="h-full glass-panel rounded-2xl flex flex-col overflow-hidden shrink-0"
        >
          {activeSidebar !== "none" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-[380px] h-full flex flex-col"
            >
              <div className="p-4 border-b border-foreground/10 font-medium flex items-center gap-2">
                {activeSidebar === "chat" ? <MessageSquare className="w-4 h-4" /> : <BarChart3 className="w-4 h-4" />}
                {activeSidebar === "chat" ? "Live Chat" : "Interactive Polls"}
              </div>
              <div className="flex-1 overflow-hidden relative">
                {activeSidebar === "chat" ? chatArea : pollsArea}
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};
