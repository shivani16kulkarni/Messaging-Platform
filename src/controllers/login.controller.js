import bcrypt from "bcrypt";
import { prisma } from "#db/prismaClient.js";
import { auth } from "#services/auth.service.js";

export default async function login(req, res) {
  try {
    const { email, password } = req.validated ?? {};

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: "email and password are required",
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Incorrect password or email",
        },
      });
    } else if (!user.emailVerifiedAt) {
      return res.status(403).json({
        success: false,
        error: { message: "Email not verified" },
      });
    } else {
      const verify = await bcrypt.compare(password, user.passwordHash);

      if (verify) {
        await auth(user, res);

        return res.status(200).json({
          success: true,
          data: {
            message: `Welcome ${user.displayName}`,
          },
        });
      } else {
        return res.status(401).json({
          success: false,
          error: {
            message: "Incorrect password or email",
          },
        });
      }
    }
  } catch (err) {
    console.error("Error in login:", err);

    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
  }
}
