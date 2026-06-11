import redis from "../lib/redis.js"

export const getCache = async(key) =>{
    const data = await redis.get(key)

    return data ? JSON.parse(data): null
}

export const setCache = async(
    key,
    value,
    ttl=300
) =>{
    await redis.set(key,JSON.stringify(value),{Ex:ttl})
}

export const deleteCache = async(key) => {
    await redis.del(key)
}