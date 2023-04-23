import { createTRPCRouter } from "~/server/api/trpc";
import { feedbackRouter } from "~/server/api/routers/feedback";

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
