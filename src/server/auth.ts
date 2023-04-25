import { getServerSession } from "next-auth";
import { type DefaultSession } from "next-auth";
import { type GetServerSidePropsContext } from "next/types";
import { authOptions } from "~/pages/api/auth/[...nextauth]";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
