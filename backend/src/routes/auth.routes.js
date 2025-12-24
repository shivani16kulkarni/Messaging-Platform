import { Router } from "express";
import signup from "#src/controllers/signup.controller.js";
import login from "#src/controllers/login.controller.js";
import refresh from "#src/controllers/refresh.controller.js";
import { loginSchema, signupSchema } from "#src/validators/auth.validator.js";
import { validate } from "#src/middleware/validate.middleware.js";
import { loginRateLimiter } from "#src/middleware/loginRateLimiter.middleware.js";
import { verifyOtp } from "#src/controllers/verifyOtp.controller.js";
import { googleRedirect } from "#src/controllers/googleRedirect.controller.js";
import { googleCallback } from "#src/controllers/googleCallback.controller.js";
const router = Router();
router.post("/signup", validate(signupSchema), signup);
router.post("/login", loginRateLimiter, validate(loginSchema), login);
router.post("/refresh", refresh);
router.post("/verify-otp", verifyOtp);
router.get("/google/redirect", googleRedirect);
router.get("/google/callback", googleCallback);

export default router;
