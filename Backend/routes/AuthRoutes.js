import Router from "express"
import AuthController from "../controllers/AuthController.js"
import AsyncHandler  from "../utils/AsyncHandler.js"
import authMiddleware  from "../middlewares/authMiddleware.js";

const router = Router()

router.post("/register",AsyncHandler(AuthController.register))
router.post("/login",AsyncHandler(AuthController.login))
router.post("/logout",authMiddleware,AsyncHandler(AuthController.logout))
router.post("/rotateToken",AsyncHandler(AuthController.rotateToken))

export default router