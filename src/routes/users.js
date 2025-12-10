import { Router } from "express";
import getMeController from "#src/controllers/getMeController.js";
import authenticateUser from "#src/middleware/authenticateUser.js";
const router = Router();
router.get("/me", authenticateUser, getMeController);

export default router;
