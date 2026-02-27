import express from "express";
import { activateUser, assignRole, changePassword, getMe, login, loginWithGoogle, logout, register, updateUser } from "../controllers/user.js";
import isAuthenticated from "../middleware/isauthenticated.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getMe);
router.put("/updateUser", isAuthenticated, updateUser);
router.put("/changePassword", isAuthenticated, changePassword);
router.put("/assignRole", isAuthenticated, assignRole);
router.put("/activateUser", isAuthenticated, activateUser);
router.post("/loginWithGoogle", loginWithGoogle);
export default router;
