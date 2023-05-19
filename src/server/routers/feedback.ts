import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/lib/trpc";
import {
  feedbackRequestSchema,
  feedbackUpdateSchema,
} from "~/utils/validation";

export const feedbackRouter = createTRPCRouter({
  createForm: protectedProcedure
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
          formSave: {
            create: {
              title: input.title,
              paragraph: "",
              authors: {
                create: [
                  {
                    email: "",
                    firstName: "",
                    lastName: "",
                  },
                ],
              },
              feedbackItems: {
                create: [
                  {
                    prompt: "",
                  },
                ],
              },
            },
          },
        },
      });
    }),

  saveForm: protectedProcedure
    .input(feedbackUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      // clear existing temp data
      await ctx.prisma.formSave.delete({
        where: {
          feedbackRequestId: input.requestId,
        },
      });
      // create new temp data
      return ctx.prisma.formSave.create({
        data: {
          feedbackRequestId: input.requestId,
          title: input.title,
          paragraph: input.paragraph,
          authors: {
            create: input.authors?.map((author) => ({
              email: author.email ?? "",
              firstName: author.firstName ?? "",
              lastName: author.lastName ?? "",
            })),
          },
          feedbackItems: {
            create: input.feedbackItems?.map((fi) => ({
              prompt: fi.prompt ?? "",
            })),
          },
        },
      });
    }),

  submitForm: protectedProcedure
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
      // ownerId
      const data = feedbackItemAuthorPairs.map(({ author, feedbackItem }) => ({
        prompt: feedbackItem.prompt,
        requestId: input.requestId,
        ownerId: input.ownerId,
        authorId: author.id,
      }));
      // include owner as author --> these are special, "empty" feedback items used for displaying the feedback items on the frontend without exposing the author
      for (const fi of input.feedbackItems) {
        data.push({
          prompt: fi.prompt,
          requestId: input.requestId,
          ownerId: input.ownerId,
          authorId: input.ownerId,
        });
      }
      // create feedback items
      void ctx.prisma.feedbackItem.createMany({
        data,
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
});
