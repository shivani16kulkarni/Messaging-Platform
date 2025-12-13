import { Router } from "express";
import {
  getMeController,
  getUserListController,
} from "#src/controllers/userController.js";
import authenticateUser from "#src/middleware/authenticateUser.js";
const router = Router();
router.get("/me", authenticateUser, getMeController);
router.get("/list", authenticateUser, getUserListController);
export default router;
