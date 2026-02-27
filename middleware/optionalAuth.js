import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const optionalAuth = async (req, res, next) => {
    const token = req.cookies?.token;
    
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            // Lấy đầy đủ thông tin user từ database
            const user = await User.findById(decoded._id).select("-password");
            if (user) {
                req.user = user;
            }
        } catch (err) {
            console.log("Error authenticating user:", err);
            // Không xóa token, tiếp tục như guest
        }
    }
    // Nếu không có token, req.user = undefined (guest)
    next();
};

export default optionalAuth;
