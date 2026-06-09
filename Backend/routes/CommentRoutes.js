import express from "express"
import CommentController from "../controllers/CommentController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/", AuthMiddleware, AsyncHandler(CommentController.createComment))
router.put("/:id", AuthMiddleware, AsyncHandler(CommentController.updateComment))
router.delete("/:id", AuthMiddleware, AsyncHandler(CommentController.deleteComment))

router.get("/questions/:id/comments", AsyncHandler(CommentController.getCommentsForQuestion))
router.get("/answers/:id/comments", AsyncHandler(CommentController.getCommentsForAnswer))


export default router