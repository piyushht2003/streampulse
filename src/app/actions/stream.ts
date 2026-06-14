"use server";

import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStreamTitle(title: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!title || title.trim() === "") {
    throw new Error("Stream title cannot be empty");
  }

  // Upsert the stream record for the user
  await prisma.stream.upsert({
    where: { userId: session.user.id },
    update: { title: title.trim() },
    create: {
      userId: session.user.id,
      title: title.trim()
    }
  });

  revalidatePath("/discover");
  revalidatePath("/dashboard/creator");
}

export async function getStreamData(userId: string) {
  const stream = await prisma.stream.findUnique({
    where: { userId }
  });
  return stream;
}
