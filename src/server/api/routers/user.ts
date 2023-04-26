import { PostType } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
  getAllUser: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
  userPostById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        select: {
          name: true,
          posts: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              type: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        where: {
          id: input.id,
        },
      });
    }),
  createPost: protectedProcedure
    .input(z.object({ content: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      const user = ctx.session.user;
      return ctx.prisma.post.create({
        data: {
          content: input.content,
          author: { connect: { id: user.id } },
          type: PostType.Post,
        },
      });
    }),
});
