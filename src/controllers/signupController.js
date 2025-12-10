import bcrypt from "bcrypt";
import { prisma } from "#db/prismaClient.js";
export default async function signUpController(req, res) {
  try {
    const { name: displayName, email, password } = req.body ?? {};

    if (!displayName || !email || !password) {
      return res.status(400).json({
        error: "name, email and password are required",
      });
    }
    const isExistingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (isExistingUser) {
      return res.status(409).json({
        error: "User with this email already exists",
      });
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          displayName,
        },
      });
      return res.status(201).json({
        id: user.id,
        email: user.email,
        displayName: user.displayName,
      });
    }
  } catch (err) {
    console.error("Error in signUpController:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
