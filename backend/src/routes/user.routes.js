import { Router } from "express";
import { getMe, getUserList } from "#src/controllers/user.controller.js";
import authenticateUser from "#src/middleware/authenticateUser.middleware.js";
const router = Router();
router.get("/me", authenticateUser, getMe);
router.get("/list", authenticateUser, getUserList);
export default router;
