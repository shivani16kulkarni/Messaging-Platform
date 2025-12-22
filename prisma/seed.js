import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "#db/prismaClient.js";

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.upsert({
    where: { email: "user1@example.com" },
    update: {},
    create: {
      email: "user1@example.com",
      displayName: "Test User 1",
      passwordHash,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "user2@example.com" },
    update: {},
    create: {
      email: "user2@example.com",
      displayName: "Test User 2",
      passwordHash,
    },
  });

  console.log("Seeded users");

  const conversation = await prisma.conversation.create({
    data: {
      participants: {
        connect: [{ id: user1.id }, { id: user2.id }],
      },
    },
  });

  console.log("Seeded conversation");

  await prisma.message.createMany({
    data: [
      {
        content: "Hey!",
        senderId: user1.id,
        conversationId: conversation.id,
      },
      {
        content: "Hi, how are you?",
        senderId: user2.id,
        conversationId: conversation.id,
      },
      {
        content: "All good. Testing messages.",
        senderId: user1.id,
        conversationId: conversation.id,
      },
    ],
  });

  console.log("Seeded messages");
}

await main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
