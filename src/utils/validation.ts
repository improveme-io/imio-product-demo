import { z } from "zod";

export const feedbackTitleSchema = z.string().nonempty("* Required");

export const feedbackParagraphSchema = z.string().nonempty("* Required");

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

export const formSchema = z.object({
  title: feedbackTitleSchema,
  paragraph: feedbackParagraphSchema,
  authors: z.array(authorSchema),
  feedbackItems: z.array(feedbackItemSchema),
});

export const feedbackRequestSchema = formSchema.extend({
  requestId: z.string().cuid(),
  ownerId: z.string().cuid(),
});
