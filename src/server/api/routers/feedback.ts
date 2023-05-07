import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
  ownedByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.feedbackRequest.findMany({
      where: { owner: { is: { clerkUserId: ctx.auth.userId } } },
      include: {
        owner: true,
        authors: true,
        feedbackItems: true,
        _count: true,
      },
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
