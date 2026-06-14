"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer overflow-hidden flex items-center justify-center w-9 h-9"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          scale: currentTheme === "dark" ? 0 : 1,
          opacity: currentTheme === "dark" ? 0 : 1,
          rotate: currentTheme === "dark" ? -90 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="absolute"
      >
        <Sun className="w-5 h-5" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: currentTheme === "dark" ? 1 : 0,
          opacity: currentTheme === "dark" ? 1 : 0,
          rotate: currentTheme === "dark" ? 0 : 90,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        className="absolute"
      >
        <Moon className="w-5 h-5" />
      </motion.div>
    </button>
  );
}
