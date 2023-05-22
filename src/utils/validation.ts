import { z } from "zod";

export const feedbackTitleSchema = z.string().nonempty("* Required");

export const feedbackParagraphSchema = z.string().nonempty("* Required");

export const deadlineSchema = z.date().nullish();

export const emailSchema = z.string().email("* Required.");
export const nameSchema = z.string().min(1, "* Required.");
export const authorSchema = z.object({
  email: emailSchema,
  firstName: nameSchema,
  lastName: nameSchema,
});

export const promptSchema = z.string().nonempty("* Required.");

export const feedbackItemSchema = z.object({
  prompt: promptSchema,
});
export type FeedbackItemForm = z.infer<typeof feedbackItemSchema>;
export function isFeedbackItem(value: unknown): value is FeedbackItemForm {
  return feedbackItemSchema.safeParse(value).success;
}

export const formSchema = z.object({
  title: feedbackTitleSchema,
  paragraph: feedbackParagraphSchema,
  deadline: deadlineSchema,
  authors: z.array(authorSchema).min(1, "* Required."),
  feedbackItems: z.array(feedbackItemSchema).min(1, "* Required."),
});

export const feedbackRequestSchema = formSchema.extend({
  requestId: z.string().cuid(),
  ownerId: z.string().cuid(),
});

// FIXME: this is horrible double bookkeeping, maybe there's a better way?
export const feedbackUpdateSchema = z.object({
  requestId: z.string().cuid(),
  title: z.string().optional(),
  paragraph: z.string().optional(),
  deadline: z.date().nullish(),
  authors: z
    .array(
      z.object({
        email: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
      })
    )
    .optional(),
  feedbackItems: z
    .array(
      z.object({
        prompt: z.string().optional(),
      })
    )
    .optional(),
});

export const payloadSchema = z
  .string()
  .min(140, "* That's less than half a tweet! Please write a bit more.");
export const authoringItem = z.object({
  id: z.string().cuid(),
  prompt: z.string(),
  payload: payloadSchema,
});
export type AuthoringFormItem = z.infer<typeof authoringItem>;
export function isAuthoringItem(value: unknown): value is AuthoringFormItem {
  return authoringItem.safeParse(value).success;
}
export const authoringForm = z.array(authoringItem);
export type AuthoringForm = z.infer<typeof authoringForm>;

export const authorUpdate = z.array(
  z.object({
    id: z.string().cuid(),
    payload: payloadSchema,
  })
);
