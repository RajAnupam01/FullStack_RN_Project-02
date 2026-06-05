import prisma from "../lib/prisma.js"

class TagController{
    static async createTags(req,res){
        const {name} = req.body;
        if(!name){
            const error = new Error("Tag Name is required.")
            error.statusCode = 400
            throw err
        }
        const normalized = name.toLowerCase().trim()

        const existingTag = await prisma.tag.findUnique({
            where:{name:normalized}
        })
        if(existingTag){
            return res.status(200).json({message:"Tag Already exist.",tag:existingTag})
        }
        const tag = await prisma.tag.create({
            data:{name:normalized}
        })
        res.status(201).json({ message: "Tag created successfully", tag })
    }


    static async getTags(req,res){
        const tags = await prisma.tag.findMany()
        return res.status(200).json(tags)
    }
}
export default TagController