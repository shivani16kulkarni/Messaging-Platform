import { Router } from "express";
import signUpController from "#src/controllers/signupController.js";
import loginController from "#src/controllers/loginController.js";
import refreshController from "#src/controllers/refreshController.js";
import { loginSchema, signupSchema } from "#src/validators/authSchema.js";
import { validate } from "#src/middleware/validate.js";
import { loginRateLimiter } from "#src/middleware/loginRateLimiter.js";
const router = Router();
router.post("/signup", validate(signupSchema), signUpController);
router.post("/login", loginRateLimiter, validate(loginSchema), loginController);
router.post("/refresh", refreshController);

export default router;
