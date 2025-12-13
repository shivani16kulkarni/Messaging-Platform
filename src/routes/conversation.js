import { Router } from "express";
import {
  postConversationController,
  getConversationsController,
  getConversationMeta,
} from "#controllers/conversationController.js";
import { createPaginationMiddleware } from "#src/middleware/pagination.js";
import authenticateUser from "#src/middleware/authenticateUser.js";
import {
  getMessagesController,
  postMessageController,
} from "#src/controllers/messageController.js";
const router = new Router();

const paginationMiddleware = createPaginationMiddleware({
  defaultLimit: 20,
  maxLimit: 50,
  allowDirections: true,
});

router.get("/", authenticateUser, getConversationsController);
router.post("/post", authenticateUser, postConversationController);
router.get("/:id", authenticateUser, getConversationMeta);
router.post("/:id/messages", authenticateUser, postMessageController);
router.get(
  "/:id/messages",
  authenticateUser,
  paginationMiddleware,
  getMessagesController
);

export default router;
