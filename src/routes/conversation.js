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
import { validate } from "#src/middleware/validate.js";
import { conversationSchema } from "#src/validators/conversationSchema.js";
import { messageSchema } from "#src/validators/messageSchema.js";
const router = new Router();

const paginationMiddleware = createPaginationMiddleware({
  defaultLimit: 20,
  maxLimit: 50,
  allowDirections: true,
});

router.get("/", authenticateUser, getConversationsController);
router.post(
  "/post",
  authenticateUser,
  validate(conversationSchema),
  postConversationController
);
router.get("/:id", authenticateUser, getConversationMeta);
router.post(
  "/:id/messages",
  authenticateUser,
  validate(messageSchema),
  postMessageController
);
router.get(
  "/:id/messages",
  authenticateUser,
  paginationMiddleware,
  getMessagesController
);

export default router;
