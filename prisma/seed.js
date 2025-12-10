import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "#db/prismaClient.js";

async function main() {
  const displayName = "Test User 1";
  const email = "example-email@example.com";
  const password = "password123";

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!existingUser) {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, passwordHash, displayName } });
    console.log("Seeded: Test User");
  } else {
    console.log("User already exists");
  }
}
await main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
