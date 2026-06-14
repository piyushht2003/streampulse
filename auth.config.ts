import type { NextAuthConfig } from 'next-auth';
import GitHub from "next-auth/providers/github";

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.role = (user as any).role;
      }
      
      // CRITICAL: NextAuth automatically copies user.image into token.picture on login!
      // If we don't delete massive base64 data URLs here, it will instantly crash the server with HTTP 431.
      if (token.picture && token.picture.startsWith("data:image")) {
        delete token.picture;
      }

      // Handle client-side or server-side session updates
      if (trigger === "update" && session) {
        if (session.role) token.role = session.role;
        if (session.user?.name) token.name = session.user.name;
        // Never store massive base64 images in JWT to prevent 431 errors!
        if (session.user?.image && !session.user.image.startsWith("data:image")) {
          token.picture = session.user.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
} satisfies NextAuthConfig;
