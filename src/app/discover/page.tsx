import { roomService } from "@/lib/livekit-server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Users, Video, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic"; // Ensure it always fetches fresh data

export default async function DiscoverPage() {
  let rooms: any[] = [];
  try {
    // Fetch all active rooms from LiveKit
    const allRooms = await roomService.listRooms();
    
    // LiveKit keeps rooms alive for a few minutes after everyone leaves by default.
    // We filter them out so "ghost" rooms don't show up on the Discover page.
    // Also, we can filter by numPublishers > 0 to ensure someone is actually broadcasting.
    rooms = allRooms.filter(r => r.numParticipants > 0);
  } catch (error) {
    console.error("Failed to fetch LiveKit rooms:", error);
  }

  // Extract user IDs from room names (format: stream-USER_ID)
  const userIds = rooms
    .filter(r => r.name.startsWith("stream-"))
    .map(r => r.name.replace("stream-", ""));

  // Fetch user profiles and stream metadata from Prisma
  let users: any[] = [];
  try {
    users = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      include: {
        stream: true
      }
    });
  } catch (error) {
    console.error("Failed to fetch users from Prisma (DB might be waking up):", error);
  }

  const streams = rooms.map(room => {
    const userId = room.name.replace("stream-", "");
    const user = users.find(u => u.id === userId);
    return {
      roomName: room.name,
      numParticipants: room.numParticipants,
      user
    };
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors font-medium text-sm" title="Back to Home">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight">Stream Directory</h1>
        </div>
        <p className="text-foreground/50 mb-10 pl-[88px]">Discover live broadcasts happening right now.</p>

        {streams.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 border border-foreground/10 rounded-3xl bg-foreground/5 backdrop-blur-sm">
            <Video className="w-16 h-16 text-foreground/20 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No active streams</h2>
            <p className="text-foreground/50">It's quiet in here. Why not start your own broadcast?</p>
            <Link href="/dashboard/creator" className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition">
              Go Live
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <Link 
                key={stream.roomName} 
                href={`/watch/${stream.roomName}`}
                className="group relative rounded-2xl overflow-hidden border border-foreground/10 bg-foreground/5 hover:bg-foreground/10 transition-all block p-1"
              >
                <div className="aspect-video bg-background rounded-xl overflow-hidden relative mb-4">
                  {/* Thumbnail Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-950 group-hover:scale-105 transition-transform duration-500">
                    <Video className="w-12 h-12 text-foreground/10" />
                  </div>
                  {/* Live Badge */}
                  <div className="absolute top-3 left-3 bg-red-500 text-foreground text-xs font-bold px-2 py-1 rounded-md flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE
                  </div>
                  {/* Viewers */}
                  <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-md text-foreground text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                    <Users className="w-3 h-3" /> {stream.numParticipants}
                  </div>
                </div>

                <div className="px-3 pb-3 flex items-start gap-3">
                  {stream.user?.image ? (
                    <img src={stream.user.image} alt={stream.user.name || "Streamer"} className="w-10 h-10 rounded-full border border-foreground/10" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary font-bold">{stream.user?.name?.[0] || "?"}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                      {stream.user?.stream?.title || `${stream.user?.name || "Anonymous Streamer"}'s Broadcast`}
                    </h3>
                    <p className="text-sm text-foreground/50">{stream.user?.name || "Unknown User"}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
