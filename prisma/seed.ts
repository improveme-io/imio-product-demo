import { PrismaClient, type Prisma } from "@prisma/client";
import { createClerkClient } from "@clerk/backend";
import { z } from "zod";
import { setTimeout } from "timers/promises";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

!process.env.SKIP_ENV_VALIDATION && (await import("../src/env.mjs"));

const prisma = new PrismaClient();
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const clerkUserSchema = z
  .object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    primaryEmailAddress: z.object({
      emailAddress: z.string(),
    }),
  })
  .transform((o) => {
    const user: Prisma.UserCreateInput = {
      clerkUserId: o.id,
      email: o.primaryEmailAddress.emailAddress,
      firstName: o.firstName,
      lastName: o.lastName,
    };
    return user;
  });

async function wipeClerk() {
  let counter = 1;

  while (counter > 0) {
    const { totalCount, data: clerkUsersToDelete } =
      await clerkClient.users.getUserList();

    if (totalCount === 0) {
      console.log("Clerk is now empty. Wiped all users from Clerk...");
      return;
    }

    const deletedClerkUsers = await Promise.all(
      clerkUsersToDelete.map((cU) => {
        return clerkClient.users.deleteUser(cU.id);
      })
    );

    console.log(
      "There are ",
      totalCount,
      "users left in Clerk. Deletied a batch of users...",
      { deletedClerkUsers }
    );

    // avoid hitting Clerk's rate limiter
    await setTimeout(1000, () => {
      counter = totalCount;
    });
  }
}

async function createTestData() {
  // ~ Clerk users
  // first email address in array is used for the primary email address
  const clerkUserDanielSmith = await clerkClient.users.createUser({
    emailAddress: ["daniel.smith81@improveme.io"],
    firstName: "Daniel",
    lastName: "Smith",
    password: "Daniel.Smith~p455w0rd",
  });
  const clerkUserEmilyJohnson = await clerkClient.users.createUser({
    emailAddress: ["emily.johnson92@improveme.io"],
    firstName: "Emily",
    lastName: "Johnson",
    password: "Emily.Johnson~p455w0rd",
  });
  const clerkUserAnnaLee = await clerkClient.users.createUser({
    emailAddress: ["anna.lee89@improveme.io"],
    firstName: "Anna",
    lastName: "Lee",
    password: "Anna.Lee~p455w0rd",
  });
  console.log("Created new test users in Clerk...", {
    clerkUserDanielSmith,
    clerkUserEmilyJohnson,
    clerkUserAnnaLee,
  });

  // ~ DB users
  const prismaUserDanielSmith = await prisma.user.create({
    data: clerkUserSchema.parse(clerkUserDanielSmith),
  });
  const prismaUserEmilyJohnson = await prisma.user.create({
    data: clerkUserSchema.parse(clerkUserEmilyJohnson),
  });
  const prismaUserAnnaLee = await prisma.user.create({
    data: clerkUserSchema.parse(clerkUserAnnaLee),
  });

  // ~ feedbacks
  const feedbackRequest100Days = await prisma.feedbackRequest.create({
    data: {
      owner: { connect: { id: prismaUserDanielSmith.id } },
      authors: { connect: [{ id: prismaUserEmilyJohnson.id }] },
      title: "100 Days Evaluation",
      status: "REQUESTED",
    },
  });
  console.log("Created feedback request...", { feedbackRequest100Days });
  const whatWentWellOwnerDanielSmith = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: prismaUserDanielSmith.id } },
      author: { connect: { id: prismaUserDanielSmith.id } },
      request: { connect: { id: feedbackRequest100Days.id } },
      prompt: "What went well?",
    },
  });
  const whatToImproveOwnerDanielSmith = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: prismaUserDanielSmith.id } },
      author: { connect: { id: prismaUserDanielSmith.id } },
      request: { connect: { id: feedbackRequest100Days.id } },
      prompt: "What to improve?",
    },
  });
  const whatWentWellEmilyJohnson = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: prismaUserDanielSmith.id } },
      author: { connect: { id: prismaUserEmilyJohnson.id } },
      request: { connect: { id: feedbackRequest100Days.id } },
      prompt: "What went well?",
    },
  });
  const whatToImproveEmilyJohnson = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: prismaUserDanielSmith.id } },
      author: { connect: { id: prismaUserEmilyJohnson.id } },
      request: { connect: { id: feedbackRequest100Days.id } },
      prompt: "What to improve?",
    },
  });
  console.log("Created feedback items...", {
    whatWentWellOwnerDanielSmith,
    whatToImproveOwnerDanielSmith,
    whatWentWellEmilyJohnson,
    whatToImproveEmilyJohnson,
  });

  const feedbackRequestQ2Peer = await prisma.feedbackRequest.create({
    data: {
      owner: { connect: { id: prismaUserEmilyJohnson.id } },
      authors: {
        connect: [
          { id: prismaUserDanielSmith.id },
          { id: prismaUserAnnaLee.id },
        ],
      },
      title: "Q2 Peer Feedback",
      status: "DONE",
    },
  });
  console.log("Created feedback request...", { feedbackRequestQ2Peer });
  const whatWentWellOwnerEmilyJohnson = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: prismaUserEmilyJohnson.id } },
      author: { connect: { id: prismaUserEmilyJohnson.id } },
      request: { connect: { id: feedbackRequestQ2Peer.id } },
      prompt: "What went well?",
    },
  });
  const whatToImproveOwnerEmilyJohnson = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: prismaUserEmilyJohnson.id } },
      author: { connect: { id: prismaUserEmilyJohnson.id } },
      request: { connect: { id: feedbackRequestQ2Peer.id } },
      prompt: "What to improve?",
    },
  });
  const whatWentWellDanielSmith = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: prismaUserEmilyJohnson.id } },
      author: { connect: { id: prismaUserDanielSmith.id } },
      request: { connect: { id: feedbackRequestQ2Peer.id } },
      prompt: "What went well?",
      payload:
        "You are my best friend, I love you and I would do anything for you. I will make you a sandwich any time you ask for it and give you bottles of expensive rare whiskeys for Christmass. I pledge to give 10% of my salary, just to prove that I am your friend. You are the best starcraft player I have ever seen, and I am so envious of you! I wish I could play StarCraft just half as well as you do.",
    },
  });
  const whatToImproveDanielSmith = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: prismaUserEmilyJohnson.id } },
      author: { connect: { id: prismaUserDanielSmith.id } },
      request: { connect: { id: feedbackRequestQ2Peer.id } },
      prompt: "What to improve?",
      payload:
        "I can not think of anything to improve. When I look in the mirror, I think about you and how perfect you are. I should probably give you another 10% of my salary. I am so happy that you are my friend, I can not imagine my life without you. I love you so much. I wish I could give you more than 10% of my salary, but I am afraid that I will not be able to afford my rent. I am so happy that you are my friend, I can not imagine my life without you. I love you so much. I wish I could give you more than 10% of my salary, but I am afraid that I will not be able to afford my rent.",
    },
  });
  const whatWentWellAnnaLee = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: prismaUserEmilyJohnson.id } },
      author: { connect: { id: prismaUserAnnaLee.id } },
      request: { connect: { id: feedbackRequestQ2Peer.id } },
      prompt: "What went well?",
      payload:
        "You are the best programmer I have ever seen. I always though that coders were dorks, but now that I metyou, it's unbelievable you are so cool! I wish I could be as cool as you are. Maybe I should dedicate my next book to you. Actually, I should probably just write a book about you.",
    },
  });
  const whatToImproveAnnaLee = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: prismaUserEmilyJohnson.id } },
      author: { connect: { id: prismaUserAnnaLee.id } },
      request: { connect: { id: feedbackRequestQ2Peer.id } },
      prompt: "What to improve?",
      payload:
        "Nothing. Literally nothing. You are perfect. I even asked my professors, and they said that you are the best programmer they have ever seen.",
    },
  });
  console.log("Created feedback items...", {
    whatWentWellOwnerEmilyJohnson,
    whatToImproveOwnerEmilyJohnson,
    whatWentWellDanielSmith,
    whatToImproveDanielSmith,
    whatWentWellAnnaLee,
    whatToImproveAnnaLee,
  });
}

/**
 * This function is intended to be run as a script via the `pnpx prisma db push --force-reset && npx prisma db seed` command. It purges all users from Clerk's Development environment, forcefully resets our DB, and then creates a few test users.
 *
 * The following email aliases are set up in FastMail, so we can receive emails to them:
 *
 * * Daniel Smith – daniel.smith81@improveme.io
 *
 * * Emily Johnson – emily.johnson92@improveme.io
 *
 * * Anna Lee –  anna.lee89@improveme.io
 *
 * * James Wilson – james.wilson75@improveme.io <-- currently unused for testing
 *
 * * Maria Garcia – maria.garcia87@improveme.io <-- currently unused for testing
 *
 */
async function main() {
  await wipeClerk();
  await createTestData();
}

try {
  await main();
  await prisma.$disconnect();
} catch (error) {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
}
