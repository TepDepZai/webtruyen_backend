import express from "express";
import { getCurrentUser, login, logout, register } from "../controllers/user.js";
import isAuthenticated from "../middleware/isauthenticated.js";

const router = express.Router();

// Đăng ký
router.post("/register", register);

// Đăng nhập
router.post("/login", login);

// Đăng xuất (cần xác thực)
router.post("/logout", isAuthenticated, logout);

// Lấy thông tin người dùng (cần xác thực)
router.get("/getCurrentUser", isAuthenticated, getCurrentUser);

export default router;
