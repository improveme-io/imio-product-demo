import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/lib/trpc";

export const feedbackRouter = createTRPCRouter({
  ownedByUser: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.feedbackRequest.findMany({
      where: { owner: { is: { clerkUserId: ctx.auth.userId } } },
      include: {
        owner: true,
        authors: true,
        feedbackItems: true,
        formSave: {
          include: {
            authors: true,
            feedbackItems: true,
          },
        },
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
        authorsStarted: true,
        authorsFinished: true,
        _count: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }),

  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().cuid(),
        authorId: z.string().cuid().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      if (!input.authorId) {
        throw new Error(
          "not implemented -- we will query the empty feedback items in this case... or all of them... or something...",
        );
      }

      return ctx.prisma.feedbackRequest.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          owner: true,
          authors: true,
          authorsStarted: true,
          authorsFinished: true,
          feedbackItems: {
            include: {
              author: true,
              owner: true,
            },
          },
          formSave: {
            include: {
              authors: true,
              feedbackItems: true,
            },
          },
          _count: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ requestId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // fetch user who is trying to delete the feedback request
      const caller = await ctx.prisma.user.findUnique({
        where: { clerkUserId: ctx.auth.userId },
      });

      // fetch feedback
      const feedback = await ctx.prisma.feedbackRequest.findUnique({
        where: { id: input.requestId },
        include: { owner: true },
      });

      // check that the owner is making the request
      if (caller?.id !== feedback?.owner.id) {
        throw new Error(
          "You are not authorized to delete this feedback request",
        );
      }

      return ctx.prisma.$transaction([
        ctx.prisma.feedbackItem.deleteMany({
          where: { requestId: input.requestId },
        }),
        ctx.prisma.feedbackRequest.delete({
          where: { id: input.requestId },
        }),
      ]);
    }),

  authoring: protectedProcedure
    .input(
      z.object({
        requestId: z.string().cuid(),
        authorClerkUserId: z.string(),
        state: z.enum(["start", "finish"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const feedback = await ctx.prisma.feedbackRequest.findUnique({
        where: { id: input.requestId },
        include: { authors: true },
      });

      if (!feedback) {
        throw new Error("Feedback request not found");
      }

      const author = feedback.authors.find(
        (author) => author.clerkUserId === input.authorClerkUserId,
      );

      if (!author) {
        throw new Error(
          "You are not authorized to change the authoring status of this feedback request",
        );
      }

      if (input.state === "start") {
        return ctx.prisma.feedbackRequest.update({
          select: { slug: true },
          where: { id: input.requestId },
          data: {
            authorsStarted: {
              connect: { id: author.id },
            },
          },
        });
      }

      if (input.state === "finish") {
        return ctx.prisma.feedbackRequest.update({
          select: { slug: true },
          where: { id: input.requestId },
          data: {
            authorsFinished: {
              connect: { id: author.id },
            },
          },
        });
      }

      throw new Error("Invalid state");
    }),
});
