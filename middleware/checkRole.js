const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        // Nếu không có user, cho phép Guest-only resources
        if (!req.user) {
            if (allowedRoles.includes("Guest")) {
                return next();
            }
            return res.status(401).json({
                success: false,
                message: "Bạn cần đăng nhập để sử dụng tính năng này",
            });
        }

        // Kiểm tra role người dùng
        if (allowedRoles.includes(req.user.role)) {
            return next();
        }

        return res.status(403).json({
            success: false,
            message: `Bạn không có quyền truy cập. Yêu cầu quyền: ${allowedRoles.join(", ")}`,
        });
    };
};

export default checkRole;
