import { createTRPCRouter } from "~/lib/trpc";
import { feedbackRouter } from "~/server/routers/feedback";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const router = createTRPCRouter({
  feedback: feedbackRouter,
});

// export type definition of API
export type AppRouter = typeof router;
