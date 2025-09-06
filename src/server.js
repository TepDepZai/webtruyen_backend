import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../db/database.js';
import userRouter from "../routes/user.js";
import cors from 'cors';
import mainPageRouter from "../routes/mainPage.js";
import paperpointRouter from "../routes/paperpoint.js";
import chapterRouter from "../routes/chapter.js";
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

connectDB();
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

const hostname = 'localhost';
const port = process.env.PORT || 2004

app.listen(port, hostname, () => {
  console.log(`chào tep, this is link for server http://${hostname}:${port}/`);
});
