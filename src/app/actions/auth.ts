"use server";

import { signIn } from "@/../auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

import { AuthError } from "next-auth";

export async function loginWithGithub() {
  await signIn("github", { redirectTo: "/dashboard/creator" }); // Redirection will be intercepted by middleware and sent to onboarding if role is null
}

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  if (!email || !password) throw new Error("Missing fields");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/" // Middleware will instantly bounce them to /onboarding if needed
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          throw new Error("Invalid email or password.");
        default:
          throw new Error("Something went wrong.");
      }
    }
    throw error; // Important: Must re-throw NEXT_REDIRECT errors!
  }
}

export async function registerWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) throw new Error("Missing fields");

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("Email already in use");
  }

  // 2. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create User in Prisma
  await prisma.user.create({
    data: {
      email,
      name: email.split("@")[0], // default name
      password: hashedPassword,
      // role defaults to null, forcing the onboarding page!
    }
  });

  // 4. Automatically sign them in
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/onboarding"
    });
  } catch (error) {
    if (error instanceof AuthError) {
      throw new Error("Failed to automatically sign in after registration.");
    }
    throw error;
  }
}
