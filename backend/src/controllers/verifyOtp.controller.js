import { prisma } from "#db/prismaClient.js";
import bcrypt from "bcrypt";

export async function verifyOtp(req, res) {
  const { userId, otp } = req.body;

  if (!otp || !userId) {
    return res.status(400).json({
      success: false,
      error: {
        message: "userID and otp are required",
      },
    });
  }
  const otpRecord = await prisma.otp.findFirst({
    where: {
      userId,
      purpose: "SIGNUP",
      usedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      error: { message: "OTP expired or invalid" },
    });
  }

  const verify = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!verify) {
    return res.status(401).json({
      success: false,
      error: {
        message: "Incorrect otp",
      },
    });
  }

  await prisma.otp.update({
    where: { id: otpRecord.id },
    data: { usedAt: new Date() },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerifiedAt: new Date(),
    },
  });
  return res.status(200).json({
    success: true,
    data: {
      message: `Signup Successful`,
    },
  });
}
