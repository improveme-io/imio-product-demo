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
import { assertDefined, getBaseURL } from "../utils";
import { FeedbackRequestedBatch } from "~/components/email/feedback-requested-batch";

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
      await ctx.prisma.formSave.delete({
        where: {
          feedbackRequestId: input.requestId,
        },
      });

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
      await ctx.prisma.$transaction(
        input.authors.map((a) =>
          ctx.prisma.user.upsert({
            where: { email: a.email.toLowerCase() },
            update: {},
            create: {
              email: a.email.toLowerCase(),
              firstName: a.firstName,
              lastName: a.lastName,
            },
          }),
        ),
      );

      const authors = await ctx.prisma.user.findMany({
        where: {
          email: { in: input.authors.map((a) => a.email.toLowerCase()) },
        },
      });

      const owner = assertDefined(
        await ctx.prisma.user.findUnique({
          where: { id: input.ownerId },
        }),
        `Owner with id ${input.ownerId} not found`,
      );

      if (authors.length !== input.authors.length) {
        const missing = input.authors
          .map((a) => a.email.toLowerCase())
          .filter((e) => !authors.some((dbAuthor) => dbAuthor.email === e));
        throw new Error(
          `The following authors could not be found or created: ${missing.join(
            ", ",
          )}`,
        );
      }

      const participants = [owner, ...authors].map((p) =>
        assertDefined(p, `Missing participant`),
      );

      if (input.is360) {
        await ctx.prisma.$transaction(
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

        const batchPayload = participants
          .filter((p) => p.id !== owner.id)
          .map((p) => ({
            from: "improveme.io <no-reply@mail.improveme.io>",
            to: p.email,
            subject: `${owner.firstName} added you to a group feedback session`,
            react: FeedbackRequested({
              authorFirstName: p.firstName,
              ownerFirstName: owner.firstName,
              ownerProfilePicURL: owner.profileImageUrl ?? undefined,
              sessionIntro: input.paragraph,
              feedbackUrl: encodeURI(`${getBaseURL()}/dashboard`),
            }),
          }));

        try {
          const response = await resend.batch.send(batchPayload);
          if (response.error) {
            console.error("Batch send error:", response.error);
          }
        } catch (error) {
          console.error("Failed to send batch 360° emails:", error);
        }

        await ctx.prisma.formSave.delete({
          where: { feedbackRequestId: input.requestId },
        });

        return {
          mode: "360",
          participants: participants.map((p) => p.email),
        };
      } else {
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
              ownerFirstName: owner.firstName,
              ownerProfilePicURL: owner.profileImageUrl ?? undefined,
              sessionIntro: input.paragraph,
              feedbackUrl: encodeURI(`${getBaseURL()}/feedback/${input.slug}`),
            });

            const { error } = await resend.emails.send({
              from: "improveme.io <no-reply@mail.improveme.io>",
              to: author.email,
              subject: `${owner.firstName} is asking for your feedback`,
              react: emailComponent,
            });

            if (error) {
              console.error(`Failed to send email to ${author.email}`, error);
            }
          }),
        );

        const updatedRequest = await ctx.prisma.feedbackRequest.update({
          where: { id: input.requestId },
          data: {
            status: "REQUESTED",
            title: input.title,
            paragraph: input.paragraph,
            deadline: input.deadline,
            is360: input.is360,
            authors: {
              connect: authors.map((a) => ({ id: a.id })),
            },
            feedbackItems: {
              connect: feedbackItems.map((fi) => ({ id: fi.id })),
            },
            formSave: { delete: true },
          },
        });

        return {
          mode: "simple",
          participants: participants.map((p) => p.email),
        };
      }
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
