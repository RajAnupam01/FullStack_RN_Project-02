import express from "express"
import FollowController from "../controllers/FollowController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()


router.post("/:id", AuthMiddleware, AsyncHandler(FollowController.followUser))
router.delete("/:id", AuthMiddleware, AsyncHandler(FollowController.unfollowUser))

export default router
