import { prisma } from "#src/db/prismaClient.js";

export default async function getMeController(req, res) {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userDetails = {
      name: user.displayName,
      email: user.email,
    };
    return res.status(200).json({
      userDetails,
    });
  } catch (err) {
    console.error("Error in userDetailsController:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
