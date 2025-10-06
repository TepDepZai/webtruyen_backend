import express from "express";
import isAuthenticated from "../middleware/isauthenticated.js";
import { deleteBookAdmin, getBookAdmin, updateBookAdmin } from "../controllers/admin.js";
const router = express.Router();

router.get("/getBookAdmin", isAuthenticated, getBookAdmin);
router.delete("/deleteBookAdmin/:id", isAuthenticated, deleteBookAdmin);
router.put("/updateBookAdmin/:id", isAuthenticated, updateBookAdmin);
export default router;