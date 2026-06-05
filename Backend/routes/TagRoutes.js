import Router from "express"
import TagController from "../controllers/TagController.js"
import AsyncHandler from "../utils/AsyncHandler.js"
import AuthMiddleware from "../middlewares/authMiddleware.js"

const router = Router()

router.post("/", AuthMiddleware, AsyncHandler(TagController.createTags))
router.get("/", AsyncHandler(TagController.getTags))

export default router