import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntigravityWrapper } from "@/components/animations/AntigravityWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StreamPulse - WebRTC Interactive Live-Streaming",
  description: "Next.js WebRTC live-streaming SaaS with Antigravity engine.",
};

import { auth } from "../../auth";
import { GlobalNav } from "@/components/layout/GlobalNav";

import { SessionProvider } from "next-auth/react";

import { ThemeProvider } from "@/components/theme/ThemeProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  // Always fetch the latest user info from the database to avoid massive JWT cookies 
  // causing HTTP 431 Request Header Fields Too Large errors.
  let dbUser = session?.user || null;
  if (session?.user?.email) {
    const { prisma } = await import("@/lib/prisma");
    const found = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    if (found) {
      dbUser = { ...session.user, ...found };
    }
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-x-hidden antialiased bg-background text-foreground`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <SessionProvider session={session}>
            <GlobalNav user={dbUser} />
            <AntigravityWrapper>
              {children}
            </AntigravityWrapper>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
