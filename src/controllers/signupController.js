import bcrypt from "bcrypt";
import { prisma } from "#db/prismaClient.js";
export default async function signUpController(req, res) {
  try {
    const { name: displayName, email, password } = req.validated ?? {};

    if (!displayName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: "name, email and password are required",
        },
      });
    }
    const isExistingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (isExistingUser) {
      return res.status(409).json({
        success: false,
        error: {
          message: "User with this email already exists",
        },
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
        success: true,
        data: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
        },
      });
    }
  } catch (err) {
    console.error("Error in signUpController:", err);

    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
  }
}
