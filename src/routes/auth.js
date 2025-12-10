import { Router } from "express";
import signUpController from "#src/controllers/signupController.js";
import loginController from "#src/controllers/loginController.js";
import refreshController from "#src/controllers/refreshController.js";
const router = Router();
router.post("/signup", signUpController);
router.post("/login", loginController);
router.post("/refresh", refreshController);

export default router;
