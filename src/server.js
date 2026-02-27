import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../db/database.js';
import userRouter from "../routes/user.js";
import cors from 'cors';
import mainPageRouter from "../routes/mainPage.js";
import paperpointRouter from "../routes/paperpoint.js";
import chapterRouter from "../routes/chapter.js";
import cookieParser from 'cookie-parser';
import adminRouter from "../routes/admin.routes.js";
import roleRouter from "../routes/role.routes.js";
import AiRouter from "./../routes/AI.routes.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { seedRoles } from "../db/seedRoles.js";

const app = express();
dotenv.config();

connectDB();

// Seed roles khi khởi động server (chỉ chạy 1 lần hoặc khi cần)
seedRoles().catch(err => console.error("Failed to seed roles:", err));

// middleware
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
// parse application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/mainPage", mainPageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/paperpoint", paperpointRouter);
app.use("/api/v1/chapter", chapterRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/role", roleRouter);
app.use("/api/v1/ai", AiRouter);
const hostname = 'localhost';
const port = process.env.PORT || 2004

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.AI_KEY
});

app.listen(port, hostname, () => {
  console.log(`chào tep, this is link for server http://${hostname}:${port}/`);
});
