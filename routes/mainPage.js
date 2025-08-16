import express from "express";
import { getAllBooks, getBookById } from "../controllers/mainPage.js";
import optionalAuth from "../middleware/optionalAuth.js";
const router = express.Router();
router.route("/getAllBooks").get(getAllBooks);
router.route("/getBookProfileById/:id").get(optionalAuth, getBookById);
export default router;