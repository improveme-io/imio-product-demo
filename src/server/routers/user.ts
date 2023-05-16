import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/lib/trpc";

export const userRouter = createTRPCRouter({
  byAuth: protectedProcedure
    // TODO: maybe we can narrow the type here for the clerk user id?
    .input(z.object({ clerkUserId: z.string().nonempty() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.user.findUnique({
        where: {
          clerkUserId: input.clerkUserId,
        },
      });
    }),
});
