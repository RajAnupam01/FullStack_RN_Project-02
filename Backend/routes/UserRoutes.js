import express from "express"
import UserController from "../controllers/UserController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"
import { upload } from "../middlewares/multer.js"

const router = express.Router()


router.get("/me", AuthMiddleware, AsyncHandler(UserController.getProfile))
router.get("/:id", AuthMiddleware, AsyncHandler(UserController.getProfileById))
router.put("/me", AuthMiddleware, upload.single("avatar"), AsyncHandler(UserController.updateProfile))
router.delete("/me", AuthMiddleware, AsyncHandler(UserController.deleteAccount))
router.get("/:id/followers",AuthMiddleware,AsyncHandler(UserController.getFollowers))
router.get("/:id/followings",AuthMiddleware,AsyncHandler(UserController.getFollowings))

export default router
