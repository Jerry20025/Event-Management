import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser"; // Import cookie-parser
import zod from "zod";
import jwt from "jsonwebtoken";

const eventRouter = express();
const prisma = new PrismaClient();

eventRouter.use(cors({
    origin:true,
    credentials:true
}));
eventRouter.use(express.json());
eventRouter.use(cookieParser()); // Use cookie-parser to parse cookies

const createEvent = zod.object({
    title: zod.string(),
    description: zod.string(),
    date: zod.string(), // This validation allows simple date strings, but Prisma expects DateTime
});
const updateEvent = zod.object({
    title: zod.string().optional(),
    description: zod.string().optional(),
    date: zod.string().optional(),
});
//@ts-ignore
const authenticateUser = async (req, res, next) => {
    try {
        // console.log("Request cookies:", req.cookie); // Log all cookies
        const token = req.cookies.token;
        // console.log("Token from cookie:", token);
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token,"hello_world");
        //@ts-ignore
        req.user = { id: decoded.id };
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Invalid token" });
    }
};


eventRouter.post('/create', authenticateUser, async (req: any, res: any) => {
    try {
        const { title, description, date } = createEvent.parse(req.body);
        // Parse the date string (assuming format: DD-MM-YYYY)
        const [year, month, day] = date.split('-').map(Number); // Convert strings to numbers
        const isoDate = new Date(year, month - 1, day).toISOString(); // Month is zero-indexed
        console.log(isoDate);
        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: isoDate,
                user: {
                    connect: {
                        id: req.user.id
                    }
                }
            }
        });
        res.json(event);
    } catch (error) {
        console.error('Date parsing error:', error);
        res.status(400).json({ error: "Invalid date format. Please use DD-MM-YYYY format." });
    }
});

eventRouter.delete('/delete/:id',authenticateUser,async(req:any,res:any)=>{
    try{
        const id=parseInt(req.params.id);
        if(isNaN(id)) return res.status(400).json({error:"Invalid event ID"});
        const event=await prisma.event.findUnique({
            where:{id}
        })
        if(!event) return res.status(404).json({error:"Event not found"});
        await prisma.event.delete({
            where:{id}
        })
        res.status(200).json({message:"Event deleted successfully"});
    }catch(error){
        res.status(500).json({error:"Internal server error"});
    }
})
eventRouter.get('/allevent',authenticateUser,async(req:any,res:any)=>{
    const events=await prisma.event.findMany({
        where:{userId:req.user.id}
    })
    if(!events) return res.status(404).json({error:"No events found"});
    res.status(200).json(events);
})
eventRouter.get('/event/:id',authenticateUser,async(req:any,res:any)=>{
    const id=parseInt(req.params.id);
    if(isNaN(id)) return res.status(400).json({error:"Invalid event ID"});
    const event=await prisma.event.findUnique({
        where:{id}
    })
    if(!event) return res.status(404).json({error:"Event not found"});
    res.status(200).json(event);
})  
eventRouter.put('/update/:id',authenticateUser,async(req:any,res:any)=>{
    const {title,description,date}=updateEvent.parse(req.body);
    let isoDate;
    if(date){
        const [year, month, day] = date.split('-').map(Number); // Convert strings to numbers
        isoDate = new Date(year, month - 1, day).toISOString(); // Month is zero-indexed
        console.log(isoDate);
    }
    console.log(isoDate);
    console.log(date);
    const id=parseInt(req.params.id);
    if(isNaN(id)) return res.status(400).json({error:"Invalid event ID"});
    const event=await prisma.event.update({
        where:{id},
        data:{
            title,
            description,
            date: isoDate ? isoDate : undefined
        }
    })
    res.status(200).json(event);
})  
export default eventRouter;
