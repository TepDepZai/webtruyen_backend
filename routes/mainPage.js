import express from "express";
import { getAllBooks, getBookById, ItemRollBar } from "../controllers/mainPage.js";
import optionalAuth from "../middleware/optionalAuth.js";
const router = express.Router();
router.route("/getAllBooks").get(getAllBooks);
router.route("/getBookProfileById/:id").get(optionalAuth, getBookById);
router.route("/ItemRollBar").get(ItemRollBar);
export default router;