import axios from "axios";
import { prisma } from "#db/prismaClient.js";
import { auth } from "#services/auth.service.js";
export async function googleCallback(req, res) {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        error: "Authorization code missing",
      });
    }

    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }
    );

    const { access_token } = tokenResponse.data;

    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const googleUser = userInfoResponse.data;

    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          googleId: googleUser.sub,
          emailVerifiedAt: new Date(),
          displayName: googleUser.name,
        },
      });
    } else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          googleId: googleUser.sub,
          emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
          displayName: user.displayName ?? googleUser.name,
        },
      });
    }
    await auth(user, res);

    return res
      .status(200)
      .send("<h1>Google Login Successful</h1><p>You can close this tab.</p>");
  } catch (error) {
    console.error("Google OAuth error:", error);
    return res.status(500).json({
      error: "Google authentication failed",
    });
  }
}
