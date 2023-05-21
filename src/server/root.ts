import { createTRPCRouter } from "~/lib/trpc";
import { feedbackRouter } from "~/server/routers/feedback";
import { formRouter } from "~/server/routers/form";
import { userRouter } from "~/server/routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const router = createTRPCRouter({
  feedback: feedbackRouter,
  form: formRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof router;
