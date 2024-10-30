import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";
import zod from "zod";
import jwt, { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

const userRouter = express();
const prisma = new PrismaClient();

userRouter.use(cors({
  origin:true,
  credentials:true  
}));
userRouter.use(express.json());

const signUpSchema = zod.object({
  name: zod.string(),
  email: zod.string().email(),
  password: zod.string(),
});

const signInSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

userRouter.post('/signup', async (req: any, res: any) => {
  try {
    const { name, email, password } = signUpSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    const token = await sign({ id: newUser.id }, "hello_world");

    res.cookie('token',token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({ user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.post('/signin', async (req: any, res: any) => {
  try {
    const { email, password } = signInSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = await sign({ id: user.id }, "hello_world");

    res.cookie('token',token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    return res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
userRouter.post('/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      sameSite: 'lax',
    });
    res.status(200).json({ message: "Logged out successfully" });
  });
  
export default userRouter;
