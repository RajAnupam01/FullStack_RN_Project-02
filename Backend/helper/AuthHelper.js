import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import ms from "ms"

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

export const generateTokens = async (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } 
  )

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } 
  )

  const refreshExpiryMs = ms(process.env.REFRESH_TOKEN_EXPIRY)
  const expiresAt = new Date(Date.now() + refreshExpiryMs)

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshToken,
      expiresAt
    }
  })

  return { accessToken, refreshToken }
}
