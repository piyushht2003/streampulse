"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPoll, getActivePoll, voteOnPoll } from "@/app/actions/polls";
import confetti from "canvas-confetti";

interface LivePollsProps {
  streamId: string;
  isHost: boolean;
}

export const LivePolls = ({ streamId, isHost }: LivePollsProps) => {
  const [poll, setPoll] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);

  useEffect(() => {
    const fetchPoll = async () => {
      const activePoll = await getActivePoll(streamId);
      if (activePoll && (!poll || activePoll.id !== poll.id)) {
        setPoll(activePoll);
        setHasVoted(false);
      } else if (activePoll) {
        setPoll(activePoll);
      }
    };
    fetchPoll();
    const interval = setInterval(fetchPoll, 3000);
    return () => clearInterval(interval);
  }, [streamId, poll]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || newOptions.some(o => !o.trim())) return;
    const created = await createPoll(streamId, newQuestion, newOptions.filter(o => o.trim()));
    setPoll(created);
    setNewQuestion("");
    setNewOptions(["", ""]);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const handleVote = async (index: number) => {
    if (hasVoted || isHost) return;
    setHasVoted(true);
    const result = await voteOnPoll(streamId, index);
    if (result.success) setPoll(result.poll);
    confetti({ particleCount: 50, spread: 40, origin: { y: 0.8 } });
  };

  const totalVotes = poll ? poll.options.reduce((acc: number, opt: any) => acc + opt.votes, 0) : 0;

  return (
    <div className="flex flex-col h-full p-4 overflow-y-auto hide-scrollbar text-foreground">
      <AnimatePresence mode="wait">
        {poll ? (
          <motion.div
            key="active-poll"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-foreground/5 border border-primary/30 p-4 rounded-xl shadow-[0_0_20px_rgba(157,78,221,0.15)] flex flex-col gap-4"
          >
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg leading-tight">{poll.question}</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-red-500/20 text-red-400 rounded-full animate-pulse">LIVE</span>
            </div>
            
            <div className="space-y-3">
              {poll.options.map((opt: any, idx: number) => {
                const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                return (
                  <button
                    key={idx}
                    onClick={() => handleVote(idx)}
                    disabled={hasVoted || isHost}
                    className="w-full relative overflow-hidden bg-foreground/5 border border-foreground/10 p-3 rounded-lg text-left transition-all hover:bg-foreground/10 disabled:cursor-default"
                  >
                    <motion.div 
                      className="absolute left-0 top-0 bottom-0 bg-primary/40 z-0"
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ type: "spring", bounce: 0, duration: 1 }}
                    />
                    <div className="relative z-10 flex justify-between font-medium text-sm">
                      <span>{opt.text}</span>
                      <span>{percentage}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground text-center mt-2">{totalVotes} total votes</div>
          </motion.div>
        ) : (
          <motion.div key="no-poll" className="text-center text-muted-foreground mt-10">
            {isHost ? "Create a poll to engage your audience!" : "Waiting for the host to start a poll..."}
          </motion.div>
        )}

        {isHost && (
          <motion.form 
            key="create-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col gap-3 p-4 bg-background/60 rounded-xl border border-foreground/10"
            onSubmit={handleCreate}
          >
            <h4 className="font-semibold text-sm mb-1">Create New Poll</h4>
            <input 
              type="text" placeholder="Question..." value={newQuestion} onChange={e => setNewQuestion(e.target.value)}
              className="bg-foreground/5 border border-foreground/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
            />
            {newOptions.map((opt, i) => (
              <input 
                key={i} type="text" placeholder={`Option ${i + 1}`} value={opt} 
                onChange={e => { const newOpts = [...newOptions]; newOpts[i] = e.target.value; setNewOptions(newOpts); }}
                className="bg-foreground/5 border border-foreground/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            ))}
            <button type="button" onClick={() => setNewOptions([...newOptions, ""])} className="text-xs text-primary text-left font-medium">+ Add Option</button>
            <button type="submit" className="mt-2 bg-primary hover:bg-primary/80 text-foreground font-medium py-2 rounded-md transition-colors">Launch Poll</button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
