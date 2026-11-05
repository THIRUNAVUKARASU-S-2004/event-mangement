import express from "express";
import { authRegisterController, authLoginController, authLogoutController } from "../Controller/authController.js";
import { validate } from "../../Middleware/validate.js";
import { registerSchema, loginLogoutSchema } from "../../schemas/userSchema.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authRegisterController);
router.post("/login", validate(loginLogoutSchema), authLoginController);
router.delete("/logout", validate(loginLogoutSchema), authLogoutController);

export default router;