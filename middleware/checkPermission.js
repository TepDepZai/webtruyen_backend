import { Role } from "../models/role.js";

// Middleware để kiểm tra permission cụ thể thay vì chỉ role
const checkPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            // Nếu không có user, chỉ cho phép Guest permissions
            if (!req.user) {
                const guestRole = await Role.findOne({ name: "Guest" });
                const hasPermission = requiredPermissions.some(perm => 
                    guestRole?.permissions.includes(perm)
                );
                
                if (hasPermission) {
                    return next();
                }
                
                return res.status(401).json({
                    success: false,
                    message: "Bạn cần đăng nhập để sử dụng tính năng này",
                });
            }

            // Lấy role của user từ database
            const userRole = await Role.findOne({ name: req.user.role });
            
            if (!userRole) {
                return res.status(403).json({
                    success: false,
                    message: "Role không hợp lệ",
                });
            }

            // Kiểm tra xem user có ít nhất một trong các permission yêu cầu không
            const hasPermission = requiredPermissions.some(perm => 
                userRole.permissions.includes(perm)
            );

            if (hasPermission) {
                // Đính kèm permissions vào request để sử dụng sau này
                req.userPermissions = userRole.permissions;
                return next();
            }

            return res.status(403).json({
                success: false,
                message: `Bạn không có quyền truy cập. Yêu cầu permission: ${requiredPermissions.join(", ")}`,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Lỗi kiểm tra quyền truy cập",
            });
        }
    };
};

export default checkPermission;
