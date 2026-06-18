import express from "express"
import QuestionController from "../controllers/QuestionController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"
import { postLimiter } from "../config/globalLimiter.js";

const router = express.Router()

router.post("/", postLimiter, AuthMiddleware, AsyncHandler(QuestionController.createQuestion))
router.post("/acceptAnswer", AuthMiddleware, AsyncHandler(QuestionController.acceptAnswer))
router.get("/", AuthMiddleware, AsyncHandler(QuestionController.getQuestions))
router.get("/me", AuthMiddleware, AsyncHandler(QuestionController.getQuestionsByMe)) 
router.get("/tag/:tagName", AuthMiddleware, AsyncHandler(QuestionController.getQuestionsByTag))
router.get("/slug/:slug", AuthMiddleware, AsyncHandler(QuestionController.getQuestionBySlug))
router.get("/:id", AsyncHandler(QuestionController.getQuestionsById)) // keep LAST
router.put("/:id", AuthMiddleware, AsyncHandler(QuestionController.updateQuestion))
router.delete("/:id", AuthMiddleware, AsyncHandler(QuestionController.deleteQuestion))


export default router
