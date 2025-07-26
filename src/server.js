import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../db/database.js';
import userRouter from "../routes/user.js";
import bodyParser from 'body-parser';
import cors from 'cors';
import paperpointRouter from "../routes/paperpoint.js";
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config();

connectDB();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logging middleware to debug requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Request body:', req.body);
  console.log('Request cookies:', req.cookies);
  next();
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/paperpoint", paperpointRouter);




const hostname = 'localhost';
const port = process.env.PORT || 2004;

app.listen(port, hostname, () => {
  console.log(`chào tep, this is link for server http://${hostname}:${port}/`);
});
