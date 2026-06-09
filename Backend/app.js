import express from "express"
import dotenv from "dotenv"
dotenv.config()

const app = express()

import AuthRouter from "./routes/AuthRoutes.js"
import UserRouter from "./routes/UserRoutes.js"
import FollowRouter from "./routes/FollowRoutes.js"
import TagRouter from "./routes/TagRoutes.js"
import QuestionRouter from "./routes/QuestionRoutes.js"
import AnswerRouter from "./routes/AnswerRoutes.js"
import BookMarkRouter from "./routes/BookMarkRoutes.js"
import CommentRouter from "./routes/CommentRoutes.js"
import VoteRouter from "./routes/VoteRoutes.js"
import NotificationRouter from './routes/NotificationRoutes.js'


import errorHandler from "./middlewares/errorHandler.js"


app.use(express.json())


app.use("/api/auth", AuthRouter)
app.use("/api/user", UserRouter)
app.use("/api/follow", FollowRouter)
app.use("/api/tag", TagRouter)
app.use("/api/question", QuestionRouter)
app.use("/api/answer", AnswerRouter)
app.use("/api/bookmark", BookMarkRouter)
app.use("/api/comment", CommentRouter)
app.use("/api/votes", VoteRouter)
app.use("/api/notification",NotificationRouter)

app.use(errorHandler)

export default app