"use client";

import { motion } from "framer-motion";
import { useConnectionQualityIndicator } from "@livekit/components-react";
import { Activity, Wifi, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export const LiveMetricsOverlay = () => {
  // Mocking LiveKit connection quality hook if out of context, 
  // normally would be: const { quality } = useConnectionQualityIndicator();
  const [bitrate, setBitrate] = useState(2500);
  const [latency, setLatency] = useState(42);

  // Simulate pulsing real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      setBitrate((prev) => prev + (Math.random() * 400 - 200));
      setLatency((prev) => Math.max(10, prev + (Math.random() * 10 - 5)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.5 }}
      className="glass-panel p-4 rounded-xl flex flex-col gap-3 min-w-[200px]"
    >
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Stream Health</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium">Bitrate</span>
        </div>
        <motion.span 
          key={Math.round(bitrate)}
          initial={{ opacity: 0.5, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-mono text-foreground"
        >
          {Math.round(bitrate)} kbps
        </motion.span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">Latency</span>
        </div>
        <motion.span 
          key={Math.round(latency)}
          initial={{ opacity: 0.5, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-mono text-foreground"
        >
          {Math.round(latency)} ms
        </motion.span>
      </div>

      {/* Physics-based visualizer instead of stiff chart */}
      <div className="h-8 w-full mt-2 flex items-end justify-between gap-1">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ height: Math.random() * 32 + 4 }}
            transition={{ type: "spring", bounce: 0, duration: 0.8, repeat: Infinity, repeatType: "mirror", delay: i * 0.05 }}
            className="w-full bg-primary/50 rounded-t-sm"
          />
        ))}
      </div>
    </motion.div>
  );
};
