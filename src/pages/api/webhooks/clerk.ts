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

//
// TODO: handle delete event
// TODO: set up local testing with webhookthing
// TODO: make local tunneling work with clerk
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { data, type } = req.body as NaiveClerkData;

  // get email address
  const emailAddress = data.email_addresses.find(
    (email) => email.id === data.primary_email_address_id
  )?.email_address as string;

  try {
    if (type === "user.created") {
      await prisma.user.upsert({
        where: { email: emailAddress },
        update: {
          clerkUserId: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          profileImageUrl: data.profile_image_url,
        },
        create: {
          clerkUserId: data.id,
          email: emailAddress,
          firstName: data.first_name,
          lastName: data.last_name,
          profileImageUrl: data.profile_image_url,
        },
      });
    } else if (type === "user.updated") {
      await prisma.user.update({
        where: { email: emailAddress },
        data: {
          clerkUserId: data.id,
          firstName: data.first_name,
          lastName: data.last_name,
          profileImageUrl: data.profile_image_url,
        },
      });
    }

    return res.status(200).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error" });
  }
}
