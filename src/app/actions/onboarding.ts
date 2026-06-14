"use server";

import { auth } from "@/../auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function setRoleAction(role: "streamer" | "viewer") {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Use raw query or casting to bypass strict Prisma Client types if generation failed due to windows lock
  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: role } as any
  });

  return { success: true };
}
