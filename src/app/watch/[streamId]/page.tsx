"use client";

import React, { useEffect, useState } from "react";
import { LiveKitRoom, VideoTrack, useTracks, useLocalParticipant, useRoomContext } from "@livekit/components-react";
import { Track } from "livekit-client";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Heart, ThumbsUp } from "lucide-react";
import { usePathname } from "next/navigation";

import { LiveChat } from "@/components/engagement/LiveChat";
import { LivePolls } from "@/components/engagement/LivePolls";

function ViewerVideoContent() {
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: false },
    { source: Track.Source.ScreenShare, withPlaceholder: false }
  ]).filter(t => !t.participant.isLocal);

  return (
    <div className="w-full h-full relative bg-background/80 flex flex-col items-center justify-center p-2 gap-2">
      {tracks.length === 0 && (
        <div className="text-foreground/50 animate-pulse">Waiting for host to start broadcast...</div>
      )}
      <div className={`w-full h-full grid gap-2 ${tracks.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {tracks.map((t) => (
          <div key={t.participant.identity + t.source} className="w-full h-full relative bg-zinc-900 border border-foreground/10 overflow-hidden shadow-2xl rounded-2xl group">
            <VideoTrack trackRef={t as any} className="w-full h-full object-contain" />
            <div className="absolute top-2 left-2 px-2 py-1 bg-background/80 backdrop-blur-md rounded-md text-xs font-semibold text-foreground/80 border border-foreground/10">
              {t.source === Track.Source.Camera ? "Host Camera" : "Host Screen"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ViewerRoom({ params }: { params: Promise<{ streamId: string }> }) {
  const [token, setToken] = useState("");
  const unwrappedParams = React.use(params);
  const streamId = unwrappedParams.streamId;
  const username = `Viewer_${Math.floor(Math.random() * 10000)}`;
  const [reactions, setReactions] = useState<{ id: number, type: 'heart' | 'thumbsup', x: number }[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`/api/livekit?room=${streamId}&username=${username}&isHost=false`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [streamId, username]);

  const triggerReaction = (type: 'heart' | 'thumbsup') => {
    const newReaction = { id: Date.now(), type, x: Math.random() * 80 + 10 };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);
  };

  if (token === "") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex bg-background text-foreground overflow-hidden relative">
      <LiveKitRoom
        video={false}
        audio={true}
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
        className="flex-1 relative flex"
      >
        <div className="flex-1 relative">
          <ViewerVideoContent />

        {/* Floating Reactions */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          <ReactionOverlay />
        </div>
      </div>

        {/* Chat / Interaction Sidebar */}
        <div className="w-96 h-full border-l border-foreground/10 glass-panel flex flex-col relative z-30">
          <div className="h-14 border-b border-foreground/10 flex items-center px-4 font-semibold shrink-0">
            Live Chat & Interaction
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="shrink-0 max-h-[50%] overflow-y-auto border-b border-foreground/10">
              <LivePolls streamId={streamId} isHost={false} />
            </div>
            <div className="flex-1 overflow-hidden relative">
              <LiveChat streamId={streamId} username={username} />
            </div>
          </div>

          <ReactionButtons />
        </div>
      </LiveKitRoom>
    </div>
  );
}

// Sub-component to handle sending reactions
function ReactionButtons() {
  const { localParticipant } = useLocalParticipant();

  const sendReaction = async (type: 'heart' | 'thumbsup') => {
    if (!localParticipant) return;
    const payloadStr = JSON.stringify({ id: Date.now(), type, x: Math.random() * 80 + 10 });
    
    // Broadcast via WebRTC
    try {
      await localParticipant.publishData(new TextEncoder().encode(payloadStr), { reliable: true, topic: "reactions" });
    } catch (e) {
      console.error("Failed to publish reaction", e);
    }
    
    // Dispatch local custom event so Viewer's own ReactionOverlay can render it instantly
    window.dispatchEvent(new CustomEvent('local-reaction', { detail: JSON.parse(payloadStr) }));
  };

  return (
    <div className="p-4 border-t border-foreground/10 flex justify-center gap-4 shrink-0 bg-foreground/5">
      <button onClick={() => sendReaction('heart')} className="p-3 rounded-full bg-foreground/5 hover:bg-foreground/10 hover:scale-110 active:scale-95 transition-all border border-foreground/10 shadow-lg"><Heart className="w-6 h-6 text-pink-500" /></button>
      <button onClick={() => sendReaction('thumbsup')} className="p-3 rounded-full bg-foreground/5 hover:bg-foreground/10 hover:scale-110 active:scale-95 transition-all border border-foreground/10 shadow-lg"><ThumbsUp className="w-6 h-6 text-blue-500" /></button>
    </div>
  );
}

// Sub-component to handle rendering incoming reactions
export function ReactionOverlay() {
  const [reactions, setReactions] = useState<{ id: number, type: 'heart' | 'thumbsup', x: number }[]>([]);
  const room = useRoomContext();

  useEffect(() => {
    // 1. Listen for WebRTC incoming reactions from other users
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

    if (room) {
      room.on('dataReceived', handleData);
    }

    // 2. Listen for local reactions from our own buttons
    const handleLocalReaction = (e: any) => {
      const reaction = e.detail;
      setReactions(prev => [...prev, reaction]);
      setTimeout(() => {
        setReactions(prev => prev.filter(r => r.id !== reaction.id));
      }, 2000);
    };
    window.addEventListener('local-reaction', handleLocalReaction);

    return () => { 
      if (room) room.off('dataReceived', handleData); 
      window.removeEventListener('local-reaction', handleLocalReaction);
    };
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
