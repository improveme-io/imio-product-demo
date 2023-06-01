import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "~/lib/prisma";

type ResponseData = {
  message: string;
};

// FIXME: this is shameful, but gotta get it done, launch is tomorrow
type NaiveClerkData = {
  data: {
    email_addresses: {
      email_address: string;
      id: string;
    }[];
    primary_email_address_id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    id: string;
  };
  type: "user.created" | "user.updated" | "user.deleted";
};

// TODO: handle delete event
// TODO: set up local testing with webhookthing
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { data, type } = req.body as NaiveClerkData;

  // get email address
  const primaryEmail = data.email_addresses.find(
    (email) => email.id === data.primary_email_address_id
  )?.email_address as string;

  try {
    if (type === "user.created") {
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
