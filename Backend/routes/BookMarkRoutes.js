import express from "express"
import BookMarkController from "../controllers/BookMarkController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()


router.post("/", AuthMiddleware, AsyncHandler(BookMarkController.createBookMark))
router.delete("/:id", AuthMiddleware, AsyncHandler(BookMarkController.deleteBookMark))
router.get("/me", AuthMiddleware, AsyncHandler(BookMarkController.getMyBookMarks))

export default router