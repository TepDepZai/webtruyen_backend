import express from "express";
import { getAllBooks } from "../controllers/mainPage.js";
const router = express.Router();
router.route("/getAllBooks").get(getAllBooks);

export default router;