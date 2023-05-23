import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/lib/trpc";
import {
  feedbackRequestSchema,
  feedbackUpdateSchema,
  authorSubmit,
  authorSave,
} from "~/utils/validation";

// TODO: use transactions
// https://www.prisma.io/docs/concepts/components/prisma-client/transactions#batchbulk-operations
export const formRouter = createTRPCRouter({
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
              paragraph:
                "I really enjoyed working with you on the project. I'm very eager to learn from my experiences and hope you'll support me on that journey. Thank you in advance for your thoughtful input!",
              deadline: new Date(),
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
                create: [],
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
          authors: {
            create: input.authors?.map((author) => ({
              email: author.email ?? "",
              firstName: author.firstName ?? "",
              lastName: author.lastName ?? "",
            })),
          },
          deadline: input.deadline,
          paragraph: input.paragraph,
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
      await ctx.prisma.$transaction(
        input.authors.map((author) =>
          ctx.prisma.user.upsert({
            where: {
              email: author.email,
            },
            update: {},
            create: {
              email: author.email,
              firstName: author.firstName,
              lastName: author.lastName,
            },
          })
        )
      );

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
      const fis = feedbackItemAuthorPairs.map(({ author, feedbackItem }) => ({
        prompt: feedbackItem.prompt,
        requestId: input.requestId,
        ownerId: input.ownerId,
        authorId: author.id,
      }));
      // include owner as author --> these are special, "empty" feedback items used for displaying the feedback items on the frontend without exposing the author
      for (const fi of input.feedbackItems) {
        fis.push({
          prompt: fi.prompt,
          requestId: input.requestId,
          ownerId: input.ownerId,
          authorId: input.ownerId,
        });
      }
      // create feedback items
      const feedbackItems = await ctx.prisma.$transaction(
        fis.map((data) =>
          ctx.prisma.feedbackItem.create({
            data,
          })
        )
      );

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
          deadline: input.deadline,
          authors: {
            connect: authors.map((author) => ({
              id: author.id,
            })),
          },
          feedbackItems: {
            connect: feedbackItems.map((fi) => ({
              id: fi.id,
            })),
          },
          // ~ clean up save ~
          formSave: {
            delete: true,
          },
        },
      });
    }),

  authorSave: protectedProcedure
    .input(z.object({ items: authorSave, requestId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.$transaction(
        input.items.map((item) =>
          ctx.prisma.feedbackItem.update({
            where: { id: item.id },
            data: { payload: item.payload },
          })
        )
      );
    }),

  authorSubmit: protectedProcedure
    .input(z.object({ items: authorSubmit, requestId: z.string().cuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.feedbackRequest.update({
        where: {
          id: input.requestId,
        },
        data: {
          authorsFinished: {
            connect: {
              clerkUserId: ctx.auth.userId,
            },
          },
        },
      });

      return ctx.prisma.$transaction(
        input.items.map((item) =>
          ctx.prisma.feedbackItem.update({
            where: { id: item.id },
            data: { payload: item.payload },
          })
        )
      );
    }),
});
