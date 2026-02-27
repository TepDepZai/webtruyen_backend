import express from "express";
import isAuthenticated from "../middleware/isauthenticated.js";
import checkRole from "../middleware/checkRole.js";
import { deleteBookAdmin, getBookAdmin, getUsersAdmin, updateBookAdmin } from "../controllers/admin.js";
const router = express.Router();

router.get("/getBookAdmin", isAuthenticated, checkRole(["Admin", "SuperAdmin"]), getBookAdmin);
router.get("/getUserAdmin", isAuthenticated, checkRole(["Admin", "SuperAdmin"]), getUsersAdmin);
router.delete("/deleteBookAdmin/:id", isAuthenticated, checkRole(["Admin", "SuperAdmin"]), deleteBookAdmin);
router.put("/updateBookAdmin/:id", isAuthenticated, checkRole(["Admin", "SuperAdmin"]), updateBookAdmin);
export default router;