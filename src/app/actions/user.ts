"use server";

import { auth, unstable_update } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const image = formData.get("image") as string;

  if (!name || name.trim() === "") {
    throw new Error("Display Name cannot be empty");
  }

  // Update in database
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: name.trim(),
      ...(image ? { image: image.trim() } : {}),
    }
  });

  // Update JWT Session so GlobalNav updates instantly
  await unstable_update({
    user: {
      name: name.trim(),
      ...(image ? { image: image.trim() } : {}),
    }
  });

  revalidatePath("/");
  revalidatePath("/settings");
}
