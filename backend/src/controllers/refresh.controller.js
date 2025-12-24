import { prisma } from "#db/prismaClient.js";
import {
  createAccessToken,
  createRefreshToken,
  createSession,
} from "#src/services/auth.service.js";

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

    const newAccessToken = await createAccessToken(userId);
    const newRefreshToken = await createRefreshToken(userId);
    await createSession(res, newAccessToken, newRefreshToken);
    await prisma.refreshToken.update({
      where: { token: requestToken },
      data: {
        expiresAt: new Date(Date.now()),
        revokedAt: new Date(Date.now()),
        replacedBy: newRefreshToken.token,
      },
    });
    return res.status(200).json({
      success: true,
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
