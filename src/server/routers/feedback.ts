import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/lib/trpc";
import { feedbackRequestSchema } from "~/utils/validation";

export const feedbackRouter = createTRPCRouter({
  createDashboard: protectedProcedure
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

  createForm: protectedProcedure
    .input(feedbackRequestSchema)
    .mutation(async ({ ctx, input }) => {
      // ~ authors ~
      // create authors
      await ctx.prisma.user.createMany({
        data: input.authors.map((author) => ({
          email: author.email,
          firstName: author.firstName,
          lastName: author.lastName,
        })),
        skipDuplicates: true,
      });
      // query authors
      const authors = await ctx.prisma.user.findMany({
        where: {
          email: {
            in: input.authors.map((author) => author.email),
          },
        },
      });
      // ~ feedback items ~
      // zip into one big list that can be passed on to prisma
      const feedbackItemAuthorPairs = authors.flatMap((a) =>
        input.feedbackItems.map((fi) => ({ author: a, feedbackItem: fi }))
      );
      // create feedback items
      void ctx.prisma.feedbackItem.createMany({
        data: feedbackItemAuthorPairs.map(({ author, feedbackItem }) => ({
          prompt: feedbackItem.prompt,
          requestId: input.requestId,
          ownerId: input.ownerId,
          authorId: author.id,
        })),
      });
      // ~ feedback request ~
      // create feedback request
      return ctx.prisma.feedbackRequest.update({
        where: {
          id: input.requestId,
        },
        data: {
          status: "REQUESTED",
          title: input.title,
          paragraph: input.paragraph,
          authors: {
            connect: authors.map((author) => ({
              id: author.id,
            })),
          },
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
        include: {
          owner: true,
          authors: true,
          feedbackItems: true,
          _count: true,
        },
      });
    }),
});
