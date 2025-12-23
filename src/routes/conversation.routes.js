import { Router } from "express";
import {
  postConversation,
  getConversations,
  getConversationMeta,
} from "#controllers/conversation.controller.js";
import { createPaginationMiddleware } from "#src/middleware/pagination.middleware.js";
import authenticateUser from "#src/middleware/authenticateUser.middleware.js";
import {
  getMessages,
  postMessage,
} from "#src/controllers/message.controller.js";
import { validate } from "#src/middleware/validate.middleware.js";
import { conversationSchema } from "#src/validators/conversation.validator.js";
import { messageSchema } from "#src/validators/message.validator.js";
const router = new Router();

const paginationMiddleware = createPaginationMiddleware({
  defaultLimit: 20,
  maxLimit: 50,
  allowDirections: true,
});

router.get("/", authenticateUser, getConversations);
router.post(
  "/post",
  authenticateUser,
  validate(conversationSchema),
  postConversation
);
router.get("/:id", authenticateUser, getConversationMeta);
router.post(
  "/:id/messages",
  authenticateUser,
  validate(messageSchema),
  postMessage
);
router.get(
  "/:id/messages",
  authenticateUser,
  paginationMiddleware,
  getMessages
);

export default router;
