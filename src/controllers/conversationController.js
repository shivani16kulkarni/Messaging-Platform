import { prisma } from "#src/db/prismaClient.js";

export async function postConversationController(req, res) {
  try {
    const userId1 = req.user.id;
    const userId2 = req.body.userId;

    if (!userId1) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!userId2) {
      return res.status(400).json({ message: "userId is required" });
    }

    const otherUserExists = await prisma.user.findFirst({
      where: { id: userId2 },
    });

    if (userId1 === userId2) {
      return res
        .status(400)
        .json({ message: "Cannot create a conversation with yourself" });
    }

    if (!otherUserExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingConversation = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: { some: { userId: userId1 } },
          },
          {
            participants: { some: { userId: userId2 } },
          },
        ],
      },
      include: {
        participants: true,
      },
    });

    if (existingConversation) {
      console.log("exisitng conversation");
      return res.status(200).json({
        conversation: existingConversation,
        created: false,
      });
    }
    console.log("new conversation");

    const newConversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId: userId1 }, { userId: userId2 }],
        },
      },
      include: {
        participants: true,
      },
    });
    return res.status(201).json({
      conversation: newConversation,
      created: true,
    });
  } catch (err) {
    console.error("Error in postConversationController:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
export async function getConversationsController(req, res) {
  try {
    const userId = req.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: { some: { userId: userId } },
      },
      include: { participants: true },
    });

    res.status(200).json({
      conversations,
    });
  } catch (err) {
    console.error("Error in getConversationsController:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getConversationMeta(req, res) {
  try {
    const conversationId = req.params.id;
    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required" });
    }
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { userId: req.user.id },
        },
      },
    });
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.status(200).json({
      conversation,
    });
  } catch (err) {
    console.error("Error in getConversationsController:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
