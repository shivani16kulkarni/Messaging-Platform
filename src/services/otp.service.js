import crypto from "crypto";
import { prisma } from "#db/prismaClient.js";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "#src/services/email.service.js";
export function generateOtpString() {
  const otp = crypto.randomInt(0, 1_000_000);
  return otp.toString().padStart(6, "0");
}

export async function generateSendOtp(userId, userEmail, purpose) {
  const otp = generateOtpString();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  await prisma.otp.updateMany({
    where: {
      userId,
      purpose,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  await prisma.otp.create({
    data: {
      userId,
      purpose,
      otpHash,
      expiresAt,
    },
  });

  await sendOtpEmail({
    to: userEmail,
    otp,
  });
}
