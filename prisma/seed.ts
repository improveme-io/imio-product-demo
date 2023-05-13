import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ~ clear db
  const feedbackItems = await prisma.feedbackItem.deleteMany();
  console.log("Deleted feedback items...", feedbackItems);
  const feedbackRequests = await prisma.feedbackRequest.deleteMany();
  console.log("Deleted feedback requests...", feedbackRequests);
  const users = await prisma.user.deleteMany();
  console.log("Deleted users...", users);

  // ~ users
  const mihaly = await prisma.user.upsert({
    where: { email: "mihaly@improveme.io" },
    update: {},
    create: {
      email: "mihaly@improveme.io",
      clerkUserId: "user_2OIdxZTccYOO3rnX8c1zl5eWk1F",
      firstName: "Mihaly",
      lastName: "Furedi",
    },
  });
  const kristof = await prisma.user.upsert({
    where: { email: "kristof@improveme.io" },
    update: {},
    create: {
      email: "kristof@improveme.io",
      clerkUserId: "user_2PYcL7UyF0RjGNpLEWbaZUZbOOT",
      firstName: "Kristof",
      lastName: "Gatter",
    },
  });
  const brooke = await prisma.user.upsert({
    where: { email: "brooke@improveme.io" },
    update: {},
    create: {
      email: "brooke@improveme.io",
      // TODO: add clerkUserId
      firstName: "Brooke",
      lastName: "Gazdag",
    },
  });
  console.log("Created users...");
  console.log({ mihaly, kristof, brooke });

  // ~ feedbacks
  const feedbackRequestAuthor = await prisma.feedbackRequest.create({
    data: {
      owner: { connect: { id: kristof.id } },
      authors: { connect: [{ id: mihaly.id }] },
      title: "Feedback Me Daddy",
    },
  });
  console.log("Created feedback request...", feedbackRequestAuthor);
  const whatWentWellMihaly = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: kristof.id } },
      author: { connect: { id: mihaly.id } },
      request: { connect: { id: feedbackRequestAuthor.id } },
      prompt: "What went well?",
      payload:
        "You are my best friend, I love you and I would do anything for you. I will make you a sandwich any time you ask for it and give you bottles of expensive rare whiskeys for Christmass. I pledge to give 10% of my salary, just to prove that I am your friend. You are the best starcraft player I have ever seen, and I am so envious of you! I wish I could play StarCraft just half as well as you do.",
    },
  });
  const whatToImproveMihaly = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: kristof.id } },
      author: { connect: { id: mihaly.id } },
      request: { connect: { id: feedbackRequestAuthor.id } },
      prompt: "What to improve?",
      payload:
        "I can not think of anything to improve. When I look in the mirror, I think about you and how perfect you are. I should probably give you another 10% of my salary. I am so happy that you are my friend, I can not imagine my life without you. I love you so much. I wish I could give you more than 10% of my salary, but I am afraid that I will not be able to afford my rent. I am so happy that you are my friend, I can not imagine my life without you. I love you so much. I wish I could give you more than 10% of my salary, but I am afraid that I will not be able to afford my rent.",
    },
  });
  console.log("Created feedback items...");
  console.log({
    whatWentWellMihaly,
    whatToImproveMihaly,
  });

  const feedbackRequestOwner = await prisma.feedbackRequest.create({
    data: {
      owner: { connect: { id: mihaly.id } },
      authors: { connect: [{ id: kristof.id }, { id: brooke.id }] },
      title: "Kristof and Brooke",
      status: "DONE",
    },
  });
  console.log("Created feedback request...", feedbackRequestOwner);
  const whatWentWellKristof = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: mihaly.id } },
      author: { connect: { id: kristof.id } },
      request: { connect: { id: feedbackRequestOwner.id } },
      prompt: "What went well?",
      payload:
        "You are my best friend, I love you and I would do anything for you. I will make you a sandwich any time you ask for it and give you bottles of expensive rare whiskeys for Christmass. I pledge to give 10% of my salary, just to prove that I am your friend. You are the best starcraft player I have ever seen, and I am so envious of you! I wish I could play StarCraft just half as well as you do.",
    },
  });
  const whatToImproveKristof = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: mihaly.id } },
      author: { connect: { id: kristof.id } },
      request: { connect: { id: feedbackRequestOwner.id } },
      prompt: "What to improve?",
      payload:
        "I can not think of anything to improve. When I look in the mirror, I think about you and how perfect you are. I should probably give you another 10% of my salary. I am so happy that you are my friend, I can not imagine my life without you. I love you so much. I wish I could give you more than 10% of my salary, but I am afraid that I will not be able to afford my rent. I am so happy that you are my friend, I can not imagine my life without you. I love you so much. I wish I could give you more than 10% of my salary, but I am afraid that I will not be able to afford my rent.",
    },
  });
  const whatWentWellBrooke = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: mihaly.id } },
      author: { connect: { id: brooke.id } },
      request: { connect: { id: feedbackRequestOwner.id } },
      prompt: "What went well?",
      payload:
        "You are the best programmer I have ever seen. I always though that coders were dorks, but now that I metyou, it's unbelievable you are so cool! I wish I could be as cool as you are. Maybe I should dedicate my next book to you. Actually, I should probably just write a book about you.",
    },
  });
  const whatToImproveBrooke = await prisma.feedbackItem.create({
    data: {
      owner: { connect: { id: mihaly.id } },
      author: { connect: { id: brooke.id } },
      request: { connect: { id: feedbackRequestOwner.id } },
      prompt: "What to improve?",
      payload:
        "Nothing. Literally nothing. You are perfect. I even asked my professors, and they said that you are the best programmer they have ever seen.",
    },
  });
  console.log("Created feedback items...");
  console.log({
    whatWentWellKristof,
    whatToImproveKristof,
    whatWentWellBrooke,
    whatToImproveBrooke,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
