import { prisma } from "#src/db/prismaClient.js";

export async function getMeController(req, res) {
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
    console.error("Error in getMeController:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
export async function getUserListController(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        email: true,
      },
    });

    return res.status(200).json({
      users,
    });
  } catch (err) {
    console.error("Error in getUserListController:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
