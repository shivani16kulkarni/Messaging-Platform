import { prisma } from "#db/prismaClient.js";
import jsonwebtoken from "jsonwebtoken";
import crypto from "crypto";

import "dotenv/config";
export default async function refresh(req, res) {
  try {
    const requestToken = req.cookies?.refreshToken;
    if (!requestToken) {
      return res.status(401).json({
        success: false,
        error: {
          message: "No credentials provided",
        },
      });
    }
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: tokenRecord },
      include: { user: true },
    });
    if (!tokenRecord) {
      return res.status(401).json({
        success: false,
        error: {
          message: "Invalid refresh token",
        },
      });
    }
    if (tokenRecord.revokedAt) {
      await prisma.refreshToken.deleteMany({
        where: { userId: tokenRecord.userId },
      });
      return res.status(403).json({
        success: false,
        error: {
          message: "Refresh token revoked",
        },
      });
    }
    if (tokenRecord.expiresAt < new Date()) {
      return res
        .status(403)
        .json({ success: false, error: { message: "Refresh token expired" } });
    }
    const newAccessToken = jsonwebtoken.sign(
      { sub: tokenRecord.user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const newRefreshToken = await prisma.refreshToken.create({
      data: {
        token,
        userId: tokenRecord.user.id,
        expiresAt,
      },
    });

    await prisma.refreshToken.update({
      where: { token: requestToken },
      data: {
        expiresAt: new Date(Date.now()),
        revokedAt: new Date(Date.now()),
        replacedBy: newRefreshToken.token,
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
        success: true,
        data: {
          accessToken: newAccessToken,
        },
      });
  } catch (err) {
    console.error("Error in refresh:", err);

    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
  }
}
