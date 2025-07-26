import express from "express";
import { changePassword, getCurrentUser, login, logout, register, updateUser } from "../controllers/user.js";
import isAuthenticated from "../middleware/isauthenticated.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/getCurrentUser", isAuthenticated, getCurrentUser);
router.put("/updateUser", isAuthenticated, updateUser);
router.put("/changePassword", isAuthenticated, changePassword);
export default router;
