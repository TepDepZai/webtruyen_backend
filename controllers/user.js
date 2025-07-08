import { User } from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(403).json({
                success: false,
                message: "This email id is already registered"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            userName,
            email,
            password: hashedPassword
        })
        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        })
    } catch (error) {
        console.log("Register error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({
            $or: [
                {
                    email: identifier
                },
                {
                    userName: identifier
                }
            ]
        });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(403).json({
                success: false,
                message: "Incorrect password"
            })
        }
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).cookie("token", token, { httpOnly: true, sameSite: "strict", maxAge: 24 * 60 * 60 * 1000 }).json({
            success: true,
            message: `Welcome back ${user.userName}`,
            token,
            user
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
export const logout = async (_, res) => {
    try {
        return res
            .status(200)
            .clearCookie("token", {
                httpOnly: true,
                sameSite: "strict",
                secure: false
            })
            .json({
                success: true,
                message: "Logout successfully."
            });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during logout"
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}