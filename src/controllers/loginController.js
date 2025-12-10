import bcrypt from "bcrypt";
import { prisma } from "#db/prismaClient.js";
import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
import crypto from "crypto";

export default async function loginController(req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({
        error: "email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect password or email",
      });
    } else {
      const verify = await bcrypt.compare(password, user.passwordHash);

      if (verify) {
        const newAccessToken = jsonwebtoken.sign(
          { sub: user.id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const newRefreshToken = await prisma.refreshToken.create({
          data: {
            token,
            userId: user.id,
            expiresAt,
          },
        });

        return res
          .cookie("refreshToken", newRefreshToken.token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
          })
          .status(200)
          .json({
            accessToken: newAccessToken,
            message: `Welcome ${user.displayName}`,
          });
      } else {
        return res.status(401).json({
          message: "Incorrect password or email",
        });
      }
    }
  } catch (err) {
    console.error("Error in loginController:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
