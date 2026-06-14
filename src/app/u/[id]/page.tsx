import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Video, Calendar, Users } from "lucide-react";
import Link from "next/link";
import { roomService } from "@/lib/livekit-server";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  const userId = unwrappedParams.id;

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    notFound();
  }

  // Check if they are currently live
  let isLive = false;
  try {
    const rooms = await roomService.listRooms([`stream-${userId}`]);
    if (rooms && rooms.length > 0) {
      isLive = true;
    }
  } catch (e) {
    // Ignore error if room doesn't exist
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Cover Image */}
      <div className="w-full h-64 bg-gradient-to-r from-primary/80 to-blue-600/80 relative">
        <div className="absolute inset-0 bg-foreground/5 backdrop-blur-sm" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative -mt-20">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-12">
          <div className="w-40 h-40 rounded-full border-4 border-[#050505] bg-zinc-900 overflow-hidden relative shadow-2xl shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name || "User"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary">
                {user.name?.[0] || "?"}
              </div>
            )}
            {isLive && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-red-500 text-foreground text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#050505] animate-pulse">
                LIVE
              </div>
            )}
          </div>

          <div className="flex-1 pb-4">
            <h1 className="text-4xl font-extrabold flex items-center gap-3">
              {user.name || "Anonymous User"}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-foreground/50 text-sm font-medium">
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 0 Followers</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined recently</span>
            </div>
          </div>

          <div className="pb-4 flex gap-3 w-full md:w-auto">
            {isLive ? (
              <Link 
                href={`/watch/stream-${userId}`}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-red-500 hover:bg-red-600 text-foreground font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-105 active:scale-95"
              >
                <Video className="w-5 h-5" /> Watch Live
              </Link>
            ) : (
              <button disabled className="flex-1 md:flex-none px-8 py-3 rounded-full bg-foreground/10 text-foreground/50 font-bold cursor-not-allowed border border-foreground/5">
                Offline
              </button>
            )}
            <button className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95">
              Follow
            </button>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-foreground/10 pb-2">About</h3>
              <p className="text-foreground/70 leading-relaxed">
                Welcome to my stream! I use StreamPulse to broadcast with sub-second latency. Drop a follow to get notified when I go live!
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">Stream Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground/50">Total Views</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-foreground/50">Peak Viewers</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
