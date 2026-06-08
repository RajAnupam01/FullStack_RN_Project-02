import express from "express"
import QuestionController from "../controllers/QuestionController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.post("/", AuthMiddleware, AsyncHandler(QuestionController.createQuestion))
router.post("/acceptAnswer",AuthMiddleware,AsyncHandler(QuestionController.acceptAnswer))
router.get("/", AsyncHandler(QuestionController.getAllQuestions))
router.get("/:id", AsyncHandler(QuestionController.getQuestionById))
router.get("/slug/:slug", AsyncHandler(QuestionController.getQuestionBySlug))
router.get("/tag/:tagName", AsyncHandler(QuestionController.getQuestionsByTag))
router.get("/me", AuthMiddleware, AsyncHandler(QuestionController.getQuestionsByMe))
router.put("/:id", AuthMiddleware, AsyncHandler(QuestionController.updateQuestion))
router.delete("/:id", AuthMiddleware, AsyncHandler(QuestionController.deleteQuestion))


export default router
