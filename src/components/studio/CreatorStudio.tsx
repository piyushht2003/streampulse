"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LiveKitRoom, 
  ControlBar, 
  VideoTrack, 
  useTracks, 
  RoomAudioRenderer,
  Chat,
  useRoomContext
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { StreamLayout } from "@/components/layout/StreamLayout";
import { LiveMetricsOverlay } from "@/components/telemetry/LiveMetricsOverlay";
import { LiveChat } from "@/components/engagement/LiveChat";
import { LivePolls } from "@/components/engagement/LivePolls";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ThumbsUp, Edit2, Check, Loader2 } from "lucide-react";
import { updateStreamTitle } from "@/app/actions/stream";
import "@livekit/components-styles";

interface CreatorStudioProps {
  userId: string;
  username: string;
  initialStreamTitle?: string;
}

// Custom component to render the Creator's own camera and screen share nicely
function StudioVideoContent() {
  // Grab the camera and screen share tracks from the current room
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]).filter(t => t.participant.isLocal);

  return (
    <div className="w-full h-full relative bg-background flex flex-col items-center justify-center p-4 gap-4">
      {tracks.length === 0 && (
        <div className="text-foreground/50 animate-pulse text-lg">
          Click the Camera or Screen icon below to start broadcasting!
        </div>
      )}
      
      {/* Grid out the tracks depending on how many there are */}
      <div className={`w-full h-full grid gap-4 ${tracks.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {tracks.map((t) => (
          <div key={t.participant.identity + t.source} className="w-full h-full relative rounded-xl overflow-hidden border border-foreground/10 shadow-2xl bg-zinc-900">
            <VideoTrack trackRef={t as any} className="w-full h-full object-contain" />
            <div className="absolute top-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-md rounded-md text-xs font-semibold text-foreground/80">
              {t.source === Track.Source.Camera ? "Webcam" : "Screen Share"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreatorStudio({ userId, username, initialStreamTitle = "My Awesome Broadcast" }: CreatorStudioProps) {
  const [token, setToken] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamTitle, setStreamTitle] = useState(initialStreamTitle);
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const roomName = `stream-${userId}`; // Unique room for this creator

  useEffect(() => {
    // Only fetch the token if they actually decide to go live
    if (!isStreaming) return;

    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${roomName}&username=${username}&isHost=true`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error("Failed to fetch token", e);
      }
    })();
  }, [roomName, username, isStreaming]);

  if (!isStreaming) {
    return (
      <div className="min-h-screen bg-background text-foreground p-8 md:p-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors font-medium text-sm" title="Back to Home">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  Back
                </Link>
                <h1 className="text-4xl font-bold tracking-tight">Creator Dashboard</h1>
              </div>
              <p className="text-foreground/50 mt-1">Welcome back, <span className="text-primary font-medium">{username}</span>. Ready to broadcast?</p>
            </div>
            <button 
              onClick={() => setIsStreaming(true)}
              className="bg-primary hover:bg-primary/90 text-foreground px-8 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(157,78,221,0.3)] hover:shadow-[0_0_30px_rgba(157,78,221,0.5)] transition-all flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Go Live Now
            </button>
          </div>

          {/* Stream Info Configuration */}
          <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 relative overflow-hidden group">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-primary" /> Stream Info
            </h2>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-semibold text-foreground/80">Stream Title</label>
                <input 
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="w-full bg-background/80 border border-foreground/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              <button 
                onClick={async () => {
                  setIsSavingTitle(true);
                  try {
                    await updateStreamTitle(streamTitle);
                  } catch (e) {
                    console.error("Failed to update title", e);
                  }
                  setIsSavingTitle(false);
                }}
                disabled={isSavingTitle || streamTitle === initialStreamTitle}
                className="bg-foreground/10 hover:bg-foreground/20 text-foreground px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSavingTitle ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                Save
              </button>
            </div>
          </div>

          {/* Stats Grid Placeholder */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Views", value: "12,345", trend: "+12%" },
              { label: "Followers", value: "892", trend: "+5%" },
              { label: "Total Stream Time", value: "42h 15m", trend: "" },
            ].map((stat, i) => (
              <div key={i} className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                <p className="text-foreground/50 text-sm font-medium mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                  {stat.trend && <span className="text-emerald-400 text-xs font-bold">{stat.trend}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Recent Streams Placeholder */}
          <div className="bg-foreground/5 border border-foreground/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Recent Broadcasts</h2>
            <div className="text-center py-12 border border-dashed border-foreground/10 rounded-xl">
              <p className="text-foreground/40">You haven't streamed recently.</p>
              <button 
                onClick={() => setIsStreaming(true)}
                className="mt-4 text-primary text-sm font-medium hover:underline"
              >
                Start your first stream!
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (token === "") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"
          />
          <p className="text-foreground/50 animate-pulse">Provisioning Secure Studio Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={false} // Start with camera off, let them use ControlBar to turn it on
      audio={false} // Start with mic off
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}
    >
      <StreamLayout
        telemetryArea={
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-full p-1.5 pr-4 shadow-2xl"
          >
             <div className="bg-red-500 text-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
             </div>
             <button 
                onClick={() => setIsStreaming(false)}
                className="text-foreground/70 hover:text-foreground text-xs font-bold transition-colors hover:scale-105 active:scale-95"
             >
                End Stream
             </button>
          </motion.div>
        }
        videoArea={
          <div className="w-full h-full relative flex flex-col bg-zinc-950">
            {/* Main Video Area */}
            <div className="flex-1 relative overflow-hidden p-2">
              <StudioVideoContent />
              <RoomAudioRenderer />
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                <ReactionOverlay />
              </div>
            </div>
            
            {/* Creator Control Bar */}
            <div className="h-20 border-t border-foreground/10 flex items-center justify-center bg-background/80 backdrop-blur-xl shrink-0">
              <ControlBar variation="verbose" controls={{ camera: true, microphone: true, screenShare: true, chat: false }} />
            </div>
          </div>
        }
        chatArea={<LiveChat streamId={roomName} username={username} />}
        pollsArea={<LivePolls streamId={roomName} isHost={true} />}
      />
    </LiveKitRoom>
  );
}

// Sub-component to handle rendering incoming reactions
export function ReactionOverlay() {
  const [reactions, setReactions] = useState<{ id: number, type: 'heart' | 'thumbsup', x: number }[]>([]);
  const room = useRoomContext();

  useEffect(() => {
    if (!room) return;
    
    const handleData = (payload: Uint8Array, participant?: any, kind?: any, topic?: string) => {
      if (topic === "reactions") {
        try {
          const str = new TextDecoder().decode(payload);
          const reaction = JSON.parse(str);
          setReactions(prev => [...prev, reaction]);
          setTimeout(() => {
            setReactions(prev => prev.filter(r => r.id !== reaction.id));
          }, 2000);
        } catch (e) {
          console.error(e);
        }
      }
    };

    room.on('dataReceived', handleData);
    return () => { room.off('dataReceived', handleData); };
  }, [room]);

  return (
    <AnimatePresence>
      {reactions.map((r) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 50, x: `${r.x}%`, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], y: -200, scale: [0.5, 1.2, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute bottom-20"
        >
          {r.type === 'heart' ? <Heart className="w-8 h-8 text-pink-500 fill-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" /> : <ThumbsUp className="w-8 h-8 text-blue-500 fill-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
