import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.feedbackRequest.findMany();
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
