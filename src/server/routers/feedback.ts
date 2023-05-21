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
      orderBy: { createdAt: "desc" },
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
      orderBy: { createdAt: "desc" },
    });
  }),

  bySlug: publicProcedure
    .input(
      z.object({
        slug: z.string().cuid(),
        authorId: z.string().cuid().optional(),
      })
    )
    .query(({ ctx, input }) => {
      if (!input.authorId) {
        throw new Error(
          "not implemented -- we will query the empty feedback items in this case... or all of them... or something..."
        );
      }

      return ctx.prisma.feedbackRequest.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          owner: true,
          authors: true,
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

  setStatus: protectedProcedure
    .input(
      z.object({
        slug: z.string().cuid(),
        // TODO: get the enum from prisma
        status: z.enum([
          "CREATING",
          "REQUESTED",
          "AUTHORING",
          "PENDING",
          "DONE",
        ]),
      })
    )
    .mutation(({ ctx, input }) => {
      // TODO: make sure the caller is an author
      return ctx.prisma.feedbackRequest.update({
        where: { slug: input.slug },
        data: { status: input.status },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ feedbackId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      // fetch user who is trying to delete the feedback request
      const caller = await ctx.prisma.user.findUnique({
        where: { clerkUserId: ctx.auth.userId },
      });

      // fetch feedback
      const feedback = await ctx.prisma.feedbackRequest.findUnique({
        where: { id: input.feedbackId },
        include: { owner: true },
      });

      // check that the owner is making the request
      if (caller?.id !== feedback?.owner.id) {
        throw new Error(
          "You are not authorized to delete this feedback request"
        );
      }

      return ctx.prisma.feedbackRequest.delete({
        where: { id: input.feedbackId },
      });
    }),
});
