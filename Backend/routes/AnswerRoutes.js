import express from "express"
import AnswerController from "../controllers/AnswerController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"
import { upload } from "../middlewares/multer.js";
import { postLimiter } from "../config/globalLimiter.js";

const router = express.Router()


router.post("/",postLimiter ,AuthMiddleware, upload.single("answer"),AsyncHandler(AnswerController.createAnswer))
router.get("/question/:questionId", AsyncHandler(AnswerController.getAnswersByQuestion))
router.put("/:id", AuthMiddleware,upload.single("answer") ,AsyncHandler(AnswerController.updateAnswer))
router.delete("/:id", AuthMiddleware, AsyncHandler(AnswerController.deleteAnswer))
router.get("/me", AuthMiddleware, AsyncHandler(AnswerController.getAnswersByMe))

export default router
