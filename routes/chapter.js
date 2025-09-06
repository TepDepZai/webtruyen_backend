import express from "express";
import { CreateChapter, deleteChapter, getChapterByIdAndNumber,  updateChapter } from "../controllers/chapter.js";
import isAuthenticated from "../middleware/isauthenticated.js";
const router = express.Router();


router.post("/createChapter", isAuthenticated, CreateChapter);
router.put("/updateChapter/:id", isAuthenticated, updateChapter);
router.delete("/deleteChapter/:id", isAuthenticated, deleteChapter);
router.get("/getChapter/:id/:number", getChapterByIdAndNumber);
export default router;