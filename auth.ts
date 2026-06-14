import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    ...authConfig.providers,
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("AUTHORIZE CALLED WITH:", credentials);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("MISSING EMAIL OR PASSWORD");
          return null;
        }
        
        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email as string } 
        });
        console.log("USER FOUND:", user ? user.email : "none");
        
        if (!user || !user.password) {
          console.log("USER HAS NO PASSWORD OR DOES NOT EXIST");
          return null;
        }
        
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string, 
          user.password
        );
        console.log("PASSWORDS MATCH:", passwordsMatch);
        
        if (passwordsMatch) return user;
        
        return null;
      }
    })
  ]
})
