import { PostType } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const exampleRouter = createTRPCRouter({
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
        where: {
          id: input.id,
        },
        include: {
          posts: true,
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
