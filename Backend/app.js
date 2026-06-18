import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import compression from "compression"
import swaggerUi from "swagger-ui-express"

import { globalLimiter } from "./config/globalLimiter.js"
import swaggerSpec from "./docs/swagger.js"
import errorHandler from "./middlewares/errorHandler.js"

import AuthRouter from "./routes/AuthRoutes.js"
import UserRouter from "./routes/UserRoutes.js"
import FollowRouter from "./routes/FollowRoutes.js"
import TagRouter from "./routes/TagRoutes.js"
import QuestionRouter from "./routes/QuestionRoutes.js"
import AnswerRouter from "./routes/AnswerRoutes.js"
import BookMarkRouter from "./routes/BookMarkRoutes.js"
import CommentRouter from "./routes/CommentRoutes.js"
import VoteRouter from "./routes/VoteRoutes.js"
import NotificationRouter from "./routes/NotificationRoutes.js"

dotenv.config()

const app = express()

// security + performance
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(compression())

// body parsing
app.use(express.json())

// rate limiter
app.use(globalLimiter)

// docs
if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

// routes
app.use("/api/auth", AuthRouter)
app.use("/api/user", UserRouter)
app.use("/api/follow", FollowRouter)
app.use("/api/tag", TagRouter)
app.use("/api/question", QuestionRouter)
app.use("/api/answer", AnswerRouter)
app.use("/api/bookmark", BookMarkRouter)
app.use("/api/comment", CommentRouter)
app.use("/api/votes", VoteRouter)
app.use("/api/notification", NotificationRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  })
})

// error handler
app.use(errorHandler)

export default app