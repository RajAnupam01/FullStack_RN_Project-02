import express from "express"
import CommentController from "../controllers/CommentController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"
import { postLimiter } from "../config/globalLimiter.js";

const router = express.Router()

router.post("/",postLimiter ,AuthMiddleware, AsyncHandler(CommentController.createComment))
router.put("/:id", AuthMiddleware, AsyncHandler(CommentController.updateComment))
router.delete("/:id", AuthMiddleware, AsyncHandler(CommentController.RemoveComment))

router.get("/questions/:id/comments",AuthMiddleware ,AsyncHandler(CommentController.getCommentForAnswer))
router.get("/answers/:id/comments", AuthMiddleware,AsyncHandler(CommentController.getCommentForAnswer))


export default router