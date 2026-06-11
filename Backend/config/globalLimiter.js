
import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message:{
        success:false,
        message:"Too many requests, please try again later."
    },
    standardHeaders:true,
    legacyHeaders:false
})

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit:10,
    message:{
        success:false,
        message:"Too many auth attempts, Try again later."
    }
})

export const postLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit:10,
    message:{
        success:false,
        messages:"Too many actions, slow down."
    }
})