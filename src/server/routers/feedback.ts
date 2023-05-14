import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/lib/trpc";

export const feedbackRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.feedbackRequest.create({
        data: {
          owner: {
            connect: {
              clerkUserId: ctx.auth.userId,
            },
          },
          title: input.title,
        },
      });
    }),

  ownedByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.feedbackRequest.findMany({
      where: { owner: { is: { clerkUserId: ctx.auth.userId } } },
      include: {
        owner: true,
        authors: true,
        feedbackItems: true,
        _count: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }),

  authoredByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.feedbackRequest.findMany({
      where: { authors: { some: { clerkUserId: ctx.auth.userId } } },
      include: {
        owner: true,
        authors: true,
        feedbackItems: true,
        _count: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string().cuid() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.feedbackRequest.findUnique({
        where: {
          slug: input.slug,
        },
      });
    }),
});
