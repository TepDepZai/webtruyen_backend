import express from "express";
import isAuthenticated from "../middleware/isauthenticated.js";
import checkRole from "../middleware/checkRole.js";
import {
    getAllRoles,
    getRoleById,
    getRoleByName,
    createRole,
    updateRole,
    deleteRole,
    getRoleStats
} from "../controllers/role.js";

const router = express.Router();

// Public routes - anyone can view roles
router.get("/getAllRoles", getAllRoles);
router.get("/getRole/:roleId", getRoleById);
router.get("/getRoleByName/:name", getRoleByName);

// Admin routes - admin can view stats
router.get("/getRoleStats", isAuthenticated, checkRole(["Admin", "SuperAdmin"]), getRoleStats);

// SuperAdmin only routes - only SuperAdmin can create/update/delete roles
router.post("/createRole", isAuthenticated, checkRole(["SuperAdmin"]), createRole);
router.put("/updateRole/:roleId", isAuthenticated, checkRole(["SuperAdmin"]), updateRole);
router.delete("/deleteRole/:roleId", isAuthenticated, checkRole(["SuperAdmin"]), deleteRole);

export default router;
