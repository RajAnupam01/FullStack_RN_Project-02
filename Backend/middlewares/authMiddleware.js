import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const error = new Error("Authorization token missing")
    error.statusCode = 401
    return next(error)
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded 
    next()
  } catch (err) {
    const error = new Error("Invalid or expired token")
    error.statusCode = 403
    next(error)
  }
}

export default authMiddleware