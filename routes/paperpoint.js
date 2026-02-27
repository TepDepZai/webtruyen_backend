import express from "express"
import { createPaperPoint, deletePaperPoint, getAllPaperPoints, getPaperPointById, updatePaperPoint } from "../controllers/paperPoint.js";
import isAuthenticated from "../middleware/isauthenticated.js";
import optionalAuth from "../middleware/optionalAuth.js";
import checkRole from "../middleware/checkRole.js";

const router = express.Router();

// Guest có thể đọc truyện (không cần login)
router.route("/getAllBooks").get(optionalAuth, checkRole(["Guest", "User", "Author", "Admin", "SuperAdmin", "Moderator"]), getAllPaperPoints);
router.route("/getBookById/:paperPointId").get(optionalAuth, checkRole(["Guest", "User", "Author", "Admin", "SuperAdmin", "Moderator"]), getPaperPointById);

// Chỉ Author/Admin có thể tạo truyện
router.route("/createbook").post(isAuthenticated, checkRole(["Author", "Admin", "SuperAdmin"]), createPaperPoint);

// Chỉ Author (chủ sở hữu) và Admin có thể chỉnh sửa/xóa
router.route("/updateBook/:paperPointId").put(isAuthenticated, checkRole(["Author", "Admin", "SuperAdmin"]), updatePaperPoint);
router.route("/deleteBook/:paperPointId").delete(isAuthenticated, checkRole(["Author", "Admin", "SuperAdmin"]), deletePaperPoint);

export default router;
