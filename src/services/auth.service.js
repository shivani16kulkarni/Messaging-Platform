import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
import crypto from "crypto";
import { prisma } from "#db/prismaClient.js";

export async function auth(user, res) {
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
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.cookie("refreshToken", newRefreshToken.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}
