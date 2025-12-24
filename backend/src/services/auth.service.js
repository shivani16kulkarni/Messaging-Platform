import jsonwebtoken from "jsonwebtoken";
import "dotenv/config";
import crypto from "crypto";
import { prisma } from "#db/prismaClient.js";

export async function createAccessToken(userId) {
  const newAccessToken = jsonwebtoken.sign(
    { sub: userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  return newAccessToken;
}
export async function createRefreshToken(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const newRefreshToken = await prisma.refreshToken.create({
    data: {
      token,
      userId: userId,
      expiresAt,
    },
  });

  return newRefreshToken;
}

export async function createSession(res, newAccessToken, newRefreshToken) {
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
