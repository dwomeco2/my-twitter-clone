import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

export const authOptions: NextAuthOptions = {
  // your configs
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: env.NEXT_PUBLIC_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    signIn({ account, profile }) {
      if (account?.provider === "google") {
        // console.log(account, profile);
      }
      return true; // Do different verification for other providers that don't have `email_verified`
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
export default NextAuth(authOptions);
