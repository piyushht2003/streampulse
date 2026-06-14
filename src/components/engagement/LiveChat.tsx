"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoomContext, useLocalParticipant } from "@livekit/components-react";

interface LiveChatProps {
  streamId: string;
  username: string;
}

export const LiveChat = ({ streamId, username }: LiveChatProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array, participant?: any, kind?: any, topic?: string) => {
      if (topic === "chat") {
        try {
          const str = new TextDecoder().decode(payload);
          const msg = JSON.parse(str);
          setMessages((prev) => [...prev, msg]);
        } catch (e) {
          console.error("Failed to parse chat message", e);
        }
      }
    };

    room.on('dataReceived', handleDataReceived);
    return () => {
      room.off('dataReceived', handleDataReceived);
    };
  }, [room]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !localParticipant) return;
    
    const newMsg = {
      id: Date.now().toString(),
      username,
      message: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };
    
    // Add locally for instant feedback
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    
    // Broadcast via WebRTC Data Channel
    try {
      const payload = new TextEncoder().encode(JSON.stringify(newMsg));
      await localParticipant.publishData(payload, { reliable: true, topic: "chat" });
    } catch (err) {
      console.error("Failed to send chat message", err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col hide-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex flex-col ${msg.username === username ? 'items-end' : 'items-start'}`}
            >
              <span className="text-xs text-muted-foreground mb-1">{msg.username}</span>
              <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm ${
                msg.username === username 
                  ? 'bg-primary text-foreground rounded-br-none shadow-[0_0_10px_rgba(157,78,221,0.2)]' 
                  : 'bg-foreground/10 text-foreground rounded-bl-none border border-foreground/5'
              }`}>
                {msg.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-foreground/10">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 bg-background/80 border border-foreground/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim()}
            className="p-2 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:hover:bg-primary text-foreground rounded-lg transition-colors flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
