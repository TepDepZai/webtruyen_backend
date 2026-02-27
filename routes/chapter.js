import express from "express";
import { CreateChapter, deleteChapter, getChapterByIdAndNumber,  updateChapter } from "../controllers/chapter.js";
import isAuthenticated from "../middleware/isauthenticated.js";
import optionalAuth from "../middleware/optionalAuth.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Guest có thể đọc chương
router.get("/getChapter/:id/:number", optionalAuth, checkRole(["Guest", "User", "Author", "Admin", "Moderator"]), getChapterByIdAndNumber);

// Chỉ Author/Admin có thể tạo/chỉnh sửa/xóa chương
router.post("/createChapter", isAuthenticated, checkRole(["Author", "Admin"]), CreateChapter);
router.put("/updateChapter/:id", isAuthenticated, checkRole(["Author", "Admin"]), updateChapter);
router.delete("/deleteChapter/:id", isAuthenticated, checkRole(["Author", "Admin"]), deleteChapter);

export default router;