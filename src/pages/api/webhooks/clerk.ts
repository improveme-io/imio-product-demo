import { Webhook } from "svix";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { type NextApiRequest, type NextApiResponse } from "next";
import { buffer } from "micro";

import { prisma } from "~/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};

// TODO: handle delete event
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env");
  }

  // Get the Svix headers for verification
  const svix_id = req.headers["svix-id"] as string;
  const svix_timestamp = req.headers["svix-timestamp"] as string;
  const svix_signature = req.headers["svix-signature"] as string;

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: "Error occured -- no svix headers" });
  }

  console.log("headers", req.headers, svix_id, svix_signature, svix_timestamp);
  // Get the body
  const body = (await buffer(req)).toString();

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Attempt to verify the incoming webhook
  // If successful, the payload will be available from 'evt'
  // If the verification fails, error out and  return error code
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);

    return res.status(400).json({ error: err });
  }

  const { data, type } = evt;

  try {
    if (type === "user.created") {
      const primaryEmail = data.email_addresses.find(
        (email) => email.id === data.primary_email_address_id
      )?.email_address as string;
      await prisma.user.upsert({
        where: { email: primaryEmail },
        update: {
          clerkUserId: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          profileImageUrl: data.profile_image_url,
        },
        create: {
          clerkUserId: data.id,
          email: primaryEmail,
          firstName: data.first_name,
          lastName: data.last_name,
          profileImageUrl: data.profile_image_url,
        },
      });
    } else if (type === "user.updated") {
      const primaryEmail = data.email_addresses.find(
        (email) => email.id === data.primary_email_address_id
      )?.email_address as string;
      // get existing user with clerkUserId
      const existingUserWithClerkId = await prisma.user.findUnique({
        where: { clerkUserId: data.id },
      });
      // get existing user with email address in update data
      const userWithEmailInUpdateData = await prisma.user.findUnique({
        where: { email: primaryEmail },
      });
      if (!existingUserWithClerkId) {
        return res.status(404).json({ message: "not found" });
      }
      // if user has a clerkUserId, and the email address they're trying to update to doesn't exist in the database, then update the user with the clerkUserId
      if (!userWithEmailInUpdateData) {
        await prisma.user.update({
          where: { clerkUserId: data.id },
          data: {
            email: primaryEmail,
            firstName: data.first_name,
            lastName: data.last_name,
            profileImageUrl: data.profile_image_url,
          },
        });
      }
      // the two users are the same, update the existing user
      if (
        userWithEmailInUpdateData?.clerkUserId &&
        userWithEmailInUpdateData?.id === existingUserWithClerkId.id
      ) {
        await prisma.user.update({
          where: { clerkUserId: data.id },
          data: {
            email: primaryEmail,
            firstName: data.first_name,
            lastName: data.last_name,
            profileImageUrl: data.profile_image_url,
          },
        });
      }
      // two users are not the same, and the user is trying to change their email to an email that already exists in the database and both users are claimed
      if (
        userWithEmailInUpdateData?.clerkUserId &&
        userWithEmailInUpdateData?.id !== existingUserWithClerkId.id
      ) {
        return res.status(409).json({
          message: `conflict: we already have a claimed user with email address ${primaryEmail}`,
        });
        // two users are not the same, and the user with the email in the update data is not claimed
      } else if (
        userWithEmailInUpdateData &&
        !userWithEmailInUpdateData?.clerkUserId
      ) {
        // get feedback items and requests authored by non-clerk user
        const feedbackItemsAuthoredByNonClerkUser =
          await prisma.feedbackItem.findMany({
            where: { author: { id: userWithEmailInUpdateData.id } },
          });
        const feedbackRequestsAuthoredByNonClerkUser =
          await prisma.feedbackRequest.findMany({
            where: { authors: { some: { id: userWithEmailInUpdateData.id } } },
          });
        // connect feedback request and feedback items to clerk user
        await prisma.user.update({
          where: { clerkUserId: data.id },
          data: {
            requestsAuthored: {
              connect: feedbackRequestsAuthoredByNonClerkUser.map(
                (request) => ({
                  id: request.id,
                })
              ),
            },
            itemsAuthored: {
              connect: feedbackItemsAuthoredByNonClerkUser.map((item) => ({
                id: item.id,
              })),
            },
          },
        });
        // delete non-clerk user
        await prisma.user.delete({
          where: { id: userWithEmailInUpdateData.id },
        });
        // update clerk user with new data
        await prisma.user.update({
          where: { clerkUserId: data.id },
          data: {
            email: primaryEmail,
            firstName: data.first_name,
            lastName: data.last_name,
            profileImageUrl: data.profile_image_url,
          },
        });
      } else {
        await prisma.user.update({
          where: { email: primaryEmail },
          data: {
            clerkUserId: data.id,
            firstName: data.first_name,
            lastName: data.last_name,
            profileImageUrl: data.profile_image_url,
          },
        });
      }
    }

    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ message: "error" });
  }
}
