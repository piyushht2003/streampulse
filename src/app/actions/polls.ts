"use server";

import { redis } from "@/lib/redis";
import { revalidatePath } from "next/cache";

export async function createPoll(streamId: string, question: string, options: string[]) {
  const pollId = Date.now().toString();
  const poll = {
    id: pollId,
    question,
    options: options.map(opt => ({ text: opt, votes: 0 })),
    active: true,
  };

  try {
    await redis.set(`poll:${streamId}`, JSON.stringify(poll));
    revalidatePath(`/dashboard/creator`);
    revalidatePath(`/watch/${streamId}`);
    return poll;
  } catch (error) {
    console.error("Redis Error creating poll:", error);
    return null;
  }
}

export async function getActivePoll(streamId: string) {
  try {
    const pollData = await redis.get(`poll:${streamId}`);
    if (!pollData) return null;
    return typeof pollData === 'string' ? JSON.parse(pollData) : pollData;
  } catch (error) {
    console.error("Redis Error fetching poll:", error);
    return null;
  }
}

export async function voteOnPoll(streamId: string, optionIndex: number) {
  try {
    const poll = await getActivePoll(streamId);
    if (!poll || !poll.active) return { success: false };

    poll.options[optionIndex].votes += 1;
    await redis.set(`poll:${streamId}`, JSON.stringify(poll));
    
    revalidatePath(`/watch/${streamId}`);
    revalidatePath(`/dashboard/creator`);
    
    return { success: true, poll };
  } catch (error) {
    console.error("Redis Error voting on poll:", error);
    return { success: false };
  }
}
