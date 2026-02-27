import { Role } from "../models/role.js";
import { User } from "../models/user.js";

export const listRoles = async (userId) => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            return {
                success: false,
                message: "User not found"
            };
        }
        
        // Chỉ SuperAdmin mới có thể xem tất cả roles
        if (user.role === "SuperAdmin" || user.role === "Admin") {
            const roles = await Role.find({}, "-__v").lean().sort({ priority: 1 });
            return {
                success: true,
                roles
            };
        }
        
        return {
            success: false,
            message: "You do not have permission to view roles"
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Error fetching roles"
        };
    }
};

export const getRolePermissions = async (roleName) => {
    try {
        const role = await Role.findOne({ name: roleName });
        
        if (!role) {
            return {
                success: false,
                message: "Role not found"
            };
        }
        
        return {
            success: true,
            permissions: role.permissions
        };
    } catch (error) {
        return {
            success: false,
            message: error.message || "Error fetching role permissions"
        };
    }
};
