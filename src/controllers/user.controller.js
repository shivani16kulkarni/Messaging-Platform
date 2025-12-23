import { prisma } from "#src/db/prismaClient.js";

export async function getMe(req, res) {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const userDetails = {
      name: user.displayName,
      email: user.email,
    };
    return res.status(200).json({
      success: true,
      data: {
        userDetails,
      },
    });
  } catch (err) {
    console.error("Error in getMe:", err);

    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
  }
}
export async function getUserList(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        email: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        users,
      },
    });
  } catch (err) {
    console.error("Error in getUserList:", err);

    return res.status(500).json({
      success: false,
      error: {
        message: "Internal server error",
      },
    });
  }
}
