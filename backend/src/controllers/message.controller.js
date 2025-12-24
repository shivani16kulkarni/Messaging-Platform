import { prisma } from "#src/db/prismaClient.js";

export async function postMessage(req, res) {
  try {
    const conversationId = req.params.id;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: {
          message: "conversationId is required",
        },
      });
    }

    const message = req.body.text;
    if (!message) {
      return res.status(400).json({
        success: false,
        error: { message: "message text is required" },
      });
    }

    const userId = req.user.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { userId },
        },
      },
    });

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, error: { message: "Conversation not found" } });
    }

    const newMessage = await prisma.message.create({
      data: {
        content: message,
        conversationId,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        message: newMessage,
      },
    });
  } catch (err) {
    console.error("Error in postMessageHandler:", err);
    return res
      .status(500)
      .json({ success: false, error: { message: "Internal server error" } });
  }
}

export async function getMessages(req, res) {
  try {
    const conversationId = req.params.id;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: { message: "conversationId is required" },
      });
    }

    const userId = req.user.id;

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        participants: {
          some: { userId },
        },
      },
    });

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, error: { message: "Conversation not found" } });
    }

    const { limit, cursor, direction } = req.pagination;
    console.log("limit", limit);
    let messages = [];
    console.log("conversationId", conversationId);
    if (!cursor || !direction) {
      console.log("Initial Load");
      messages = await prisma.message.findMany({
        where: { conversationId },
        orderBy: { id: "desc" },
        take: limit,
      });

      console.log("messages", messages);

      messages = messages.reverse();

      const olderCursor = messages.length > 0 ? messages[0].id : null;
      const newerCursor =
        messages.length > 0 ? messages[messages.length - 1].id : null;

      const hasOlder = messages.length === limit;
      const hasNewer = false;

      return res.status(200).json({
        success: true,
        data: {
          messages,
          pageInfo: { olderCursor, newerCursor, hasOlder, hasNewer, limit },
        },
      });
    }
    if (direction === "Older") {
      messages = await prisma.message.findMany({
        where: { id: { conversationId: { lt: limit } } },
        orderBy: { id: "asc" },
        take: limit,
      });

      const olderCursor = messages.length > 0 ? messages[0].id : null;
      const newerCursor =
        messages.length > 0 ? messages[messages.length - 1].id : null;

      const hasOlder = messages.length === limit;
      const hasNewer = true;

      return res.status(200).json({
        success: true,
        data: {
          messages,
          pageInfo: { olderCursor, newerCursor, hasOlder, hasNewer, limit },
        },
      });
    }
    if (direction === "Newer") {
      messages = await prisma.message.findMany({
        where: { id: { conversationId: { gt: limit } } },
        orderBy: { id: "asc" },
        take: limit,
      });

      const olderCursor = messages.length > 0 ? messages[0].id : null;
      const newerCursor =
        messages.length > 0 ? messages[messages.length - 1].id : null;

      const hasOlder = true;
      const hasNewer = messages.length === limit;

      return res.status(200).json({
        success: true,
        data: {
          messages,
          pageInfo: { olderCursor, newerCursor, hasOlder, hasNewer, limit },
        },
      });
    }
  } catch (err) {
    console.error("Error in postMessageHandler:", err);
    return res.status(500).json({
      success: false,
      error: { message: "Internal server error" },
    });
  }
}
