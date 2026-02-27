import { Role } from "../models/role.js";
import { User } from "../models/user.js";

// Lấy tất cả roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find()
            .select("-__v")
            .sort({ priority: 1 })
            .lean();
        
        return res.status(200).json({
            success: true,
            roles
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi server"
        });
    }
};

// Lấy role theo ID
export const getRoleById = async (req, res) => {
    try {
        const { roleId } = req.params;
        const role = await Role.findById(roleId).select("-__v");
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            role
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi server"
        });
    }
};

// Lấy role theo tên
export const getRoleByName = async (req, res) => {
    try {
        const { name } = req.params;
        const role = await Role.findOne({ name }).select("-__v");
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            role
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi server"
        });
    }
};

// Tạo role mới (chỉ SuperAdmin)
export const createRole = async (req, res) => {
    try {
        const { name, description, permissions, priority } = req.body;
        
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description are required"
            });
        }
        
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: "Role already exists"
            });
        }
        
        const role = await Role.create({
            name,
            description,
            permissions: permissions || [],
            priority: priority || 50
        });
        
        return res.status(201).json({
            success: true,
            role,
            message: "Role created successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi server"
        });
    }
};

// Cập nhật role (chỉ SuperAdmin)
export const updateRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const { description, permissions, priority, isActive } = req.body;
        
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }
        
        // Không cho phép thay đổi tên role
        const updateData = {};
        if (description !== undefined) updateData.description = description;
        if (permissions !== undefined) updateData.permissions = permissions;
        if (priority !== undefined) updateData.priority = priority;
        if (isActive !== undefined) updateData.isActive = isActive;
        
        const updatedRole = await Role.findByIdAndUpdate(
            roleId,
            { $set: updateData },
            { new: true }
        );
        
        return res.status(200).json({
            success: true,
            role: updatedRole,
            message: "Role updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi server"
        });
    }
};

// Xóa role (chỉ SuperAdmin) - cẩn thận với việc này
export const deleteRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }
        
        // Không cho phép xóa các role cơ bản
        const protectedRoles = ["Guest", "User", "Author", "Admin", "SuperAdmin"];
        if (protectedRoles.includes(role.name)) {
            return res.status(403).json({
                success: false,
                message: "Cannot delete protected role"
            });
        }
        
        // Kiểm tra xem có user nào đang dùng role này không
        const usersWithRole = await User.countDocuments({ role: role.name });
        if (usersWithRole > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete role. ${usersWithRole} user(s) are using this role.`
            });
        }
        
        await Role.findByIdAndDelete(roleId);
        
        return res.status(200).json({
            success: true,
            message: "Role deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi server"
        });
    }
};

// Lấy thống kê role
export const getRoleStats = async (req, res) => {
    try {
        const roles = await Role.find().select("name totalUsers").lean();
        
        // Cập nhật số lượng user cho mỗi role
        const roleStats = await Promise.all(
            roles.map(async (role) => {
                const count = await User.countDocuments({ role: role.name });
                // Cập nhật totalUsers trong database
                await Role.findOneAndUpdate(
                    { name: role.name },
                    { $set: { totalUsers: count } }
                );
                return {
                    ...role,
                    totalUsers: count
                };
            })
        );
        
        return res.status(200).json({
            success: true,
            stats: roleStats
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi server"
        });
    }
};
