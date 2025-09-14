import express from "express";
import { activateUser, assignRole, changePassword, getAllUsers, getCurrentUser, login, loginWithGoogle, logout, register, updateUser } from "../controllers/user.js";
import isAuthenticated from "../middleware/isauthenticated.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/getCurrentUser", isAuthenticated, getCurrentUser);
router.put("/updateUser", isAuthenticated, updateUser);
router.put("/changePassword", isAuthenticated, changePassword);
router.get("/getAllUsers", isAuthenticated, getAllUsers);
router.put("/assignRole", isAuthenticated, assignRole);
router.put("/activateUser", isAuthenticated, activateUser);
router.post("/loginWithGoogle", loginWithGoogle);
export default router;
