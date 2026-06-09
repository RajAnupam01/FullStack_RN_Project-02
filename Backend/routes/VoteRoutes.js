import express from "express"
import VoteController from "../controllers/VoteController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()
router.post("/questions/:id/vote", AuthMiddleware, AsyncHandler(VoteController.voteQuestion))
router.post("/answers/:id/vote", AuthMiddleware, AsyncHandler(VoteController.voteAnswer))



export default router