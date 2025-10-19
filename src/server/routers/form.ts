import { z } from "zod";

import { Resend } from "resend";
import { FeedbackRequested } from "../../components/email/feedback-requested";

const resend = new Resend(process.env.RESEND_API_KEY);

import { createTRPCRouter, protectedProcedure } from "~/lib/trpc";
import {
  feedbackRequestSchema,
  feedbackUpdateSchema,
  authorSubmit,
  authorSave,
} from "~/utils/validation";
import { getBaseURL } from "../utils";

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
              email: author.email?.toLowerCase() ?? "",
              firstName: author.firstName ?? "",
              lastName: author.lastName ?? "",
            })),
          },
          deadline: input.deadline,
          is360: input.is360,
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
      // Upsert all users (authors)
      await ctx.prisma.$transaction(
        input.authors.map((author) =>
          ctx.prisma.user.upsert({
            where: { email: author.email.toLowerCase() },
            update: {},
            create: {
              email: author.email.toLowerCase(),
              firstName: author.firstName,
              lastName: author.lastName,
            },
          }),
        ),
      );

      // Get actual user records (authors)
      const authors = await ctx.prisma.user.findMany({
        where: {
          email: {
            in: input.authors.map((a) => a.email.toLowerCase()),
          },
        },
      });

      const owner = await ctx.prisma.user.findUnique({
        where: { id: input.ownerId },
      });

      if (!owner) throw new Error(`Owner not found for id ${input.ownerId}`);

      if (authors.length !== input.authors.length) {
        throw new Error("Author mismatch – some could not be found or created");
      }

      const participants = [owner, ...authors];

      // \===========================================================
      // === 360° FULL GRAPH GENERATION
      // \===========================================================
      if (input.is360) {
        const createdRequests = await ctx.prisma.$transaction(
          participants.map((participant) => {
            const otherAuthors = participants.filter(
              (p) => p.id !== participant.id,
            );

            return ctx.prisma.feedbackRequest.create({
              data: {
                status: "REQUESTED",
                title: input.title,
                paragraph: input.paragraph,
                deadline: input.deadline,
                is360: true,
                owner: { connect: { id: participant.id } },
                authors: {
                  connect: otherAuthors.map((a) => ({ id: a.id })),
                },
                feedbackItems: {
                  create: otherAuthors.flatMap((a) =>
                    input.feedbackItems.map((fi) => ({
                      prompt: fi.prompt,
                      owner: { connect: { id: participant.id } },
                      author: { connect: { id: a.id } },
                    })),
                  ),
                },
              },
            });
          }),
        );

        // Send one email to each participant
        await Promise.all(
          participants.map(async (p) => {
            const emailComponent = FeedbackRequested({
              authorFirstName: p.firstName,
              ownerFirstName: owner?.firstName ?? "",
              feedbackUrl: encodeURI(`${getBaseURL()}/dashboard`),
              ownerProfilePicURL: owner.profileImageUrl
                ? encodeURI(owner.profileImageUrl)
                : undefined,
              sessionIntro: input.paragraph,
            });

            const { error } = await resend.emails.send({
              from: "improveme.io <no-reply@mail.improveme.io>",
              to: p.email,
              subject: `You've been added to a 360° feedback session`,
              react: emailComponent,
            });

            if (error) {
              console.error(`Failed to send 360° email to ${p.email}`, error);
            }
          }),
        );

        await ctx.prisma.formSave.delete({
          where: { feedbackRequestId: input.requestId },
        });

        return createdRequests;
      }

      // \===========================================================
      // === DEFAULT (non-360) FLOW
      // \===========================================================

      // Old logic preserved (owner -> authors)
      const feedbackItemAuthorPairs = authors.flatMap((a) =>
        input.feedbackItems.map((fi) => ({ author: a, feedbackItem: fi })),
      );

      const fis = feedbackItemAuthorPairs.map(({ author, feedbackItem }) => ({
        prompt: feedbackItem.prompt,
        requestId: input.requestId,
        ownerId: input.ownerId,
        authorId: author.id,
      }));

      for (const fi of input.feedbackItems) {
        fis.push({
          prompt: fi.prompt,
          requestId: input.requestId,
          ownerId: input.ownerId,
          authorId: input.ownerId,
        });
      }

      const feedbackItems = await ctx.prisma.$transaction(
        fis.map((data) =>
          ctx.prisma.feedbackItem.create({
            data,
          }),
        ),
      );

      await Promise.all(
        authors.map(async (author) => {
          const emailComponent = FeedbackRequested({
            authorFirstName: author.firstName,
            ownerFirstName: owner?.firstName ?? "",
            feedbackUrl: encodeURI(`${getBaseURL()}/feedback/${input.slug}`),
            ownerProfilePicURL: owner.profileImageUrl
              ? encodeURI(owner.profileImageUrl)
              : undefined,
            sessionIntro: input.paragraph,
          });

          const { error } = await resend.emails.send({
            from: "improveme.io <no-reply@mail.improveme.io>",
            to: author.email,
            subject: `${owner?.firstName ?? ""} is asking for your feedback`,
            react: emailComponent,
          });

          if (error) {
            console.error(`Failed to send email to ${author.email}`, error);
          }
        }),
      );

      return ctx.prisma.feedbackRequest.update({
        where: { id: input.requestId },
        data: {
          status: "REQUESTED",
          title: input.title,
          paragraph: input.paragraph,
          deadline: input.deadline,
          is360: input.is360,
          authors: {
            connect: authors.map((author) => ({ id: author.id })),
          },
          feedbackItems: {
            connect: feedbackItems.map((fi) => ({ id: fi.id })),
          },
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
          }),
        ),
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
          }),
        ),
      );
    }),
});
