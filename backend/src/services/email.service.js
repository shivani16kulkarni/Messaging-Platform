import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail({ to, otp }) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your verification code",
    text: `Your OTP is ${otp}. It expires in 2 minutes.`,
  });
}
