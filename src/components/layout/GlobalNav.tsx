"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Settings, LayoutDashboard, Compass, User as UserIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface GlobalNavProps {
  user: any;
}

export function GlobalNav({ user }: GlobalNavProps) {
  const pathname = usePathname();

  // Hide the global nav on specific routes
  const hiddenRoutes = ["/login", "/onboarding", "/dashboard/creator", "/watch"];
  const isHidden = hiddenRoutes.some(route => pathname.startsWith(route));

  if (isHidden) return null;

  return (
    <nav className="sticky top-0 w-full z-50 bg-background/50 backdrop-blur-xl border-b border-foreground/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-3 h-3 rounded-full bg-primary group-hover:shadow-[0_0_15px_rgba(157,78,221,0.8)] transition-all" />
          <span className="font-bold text-xl tracking-tight text-foreground group-hover:text-primary transition-colors">StreamPulse</span>
        </Link>

        {/* Links */}
        {user && (
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/discover" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/discover' ? 'text-foreground' : 'text-foreground/50 hover:text-foreground'}`}
            >
              <Compass className="w-4 h-4" /> Discover
            </Link>
            
            {user.role === "streamer" && (
              <Link 
                href="/dashboard/creator" 
                className="flex items-center gap-2 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> Creator Studio
              </Link>
            )}
          </div>
        )}

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/settings"
                className={`p-2 rounded-full transition-colors ${pathname === '/settings' ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'}`}
              >
                <Settings className="w-5 h-5" />
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 rounded-full text-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 pl-4 border-l border-foreground/10">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-4 h-4 text-primary" />
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
              </div>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 rounded-full bg-primary text-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Log In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}
