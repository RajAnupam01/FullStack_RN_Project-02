import Router from "express"
import AuthController from "../controllers/AuthController.js"
import AsyncHandler  from "../utils/AsyncHandler.js"
import authMiddleware  from "../middlewares/authMiddleware.js";
import { authLimiter } from "../config/globalLimiter.js";

const router = Router()

router.post("/register",authLimiter,AsyncHandler(AuthController.register))
router.post("/login",authLimiter,AsyncHandler(AuthController.login))
router.post("/logout",authMiddleware,AsyncHandler(AuthController.logout))
router.post("/rotateToken",AsyncHandler(AuthController.rotateToken))

export default router