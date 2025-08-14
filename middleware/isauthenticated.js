import jwt from "jsonwebtoken";
import { User } from "../models/user.js"; // import model user

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        // 1. Kiểm tra token có tồn tại không
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Bạn chưa đăng nhập",
            });
        }

        // 2. Giải mã token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token không hợp lệ hoặc đã hết hạn",
            });
        }
        // 3. Kiểm tra user có tồn tại không
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Tài khoản không tồn tại hoặc đã bị khóa",
            });
        }

        // 4. Gắn user vào request để các route khác dùng
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi xác thực máy chủ",
        });
    }
};

export default isAuthenticated;
