import jwt from "jsonwebtoken";

const optionalAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = decoded;
        } catch (err) {
            console.log("Error authenticating user:", err);
        }
    }
    next();
};

export default optionalAuth;
