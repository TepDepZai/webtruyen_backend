import { User } from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { userName, email, password, fullName } = req.body;
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
            fullName,
            password: hashedPassword,
            role: "User"
        })
        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        })
    } catch (error) {
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
            return ({
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
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 24 * 60 * 60 * 1000 }).json({
            success: true,
            message: `Welcome back ${user.userName}`,
            token,
            user
        })
    } catch (error) {
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
                sameSite: "lax",
                secure: false
            })
            .json({
                success: true,
                message: "Logout successfully."
            });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error during logout"
        });
    }
};
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?._id;
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
            user: {
                id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                email: user.email,
                createdAt: user.createdAt,
                role: user.role,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}
export const updateUser = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        const { fullName } = req.body;
        if (!fullName) {
            return res.status(400).json({
                success: false,
                message: "Full name is required"
            });
        }
        if (fullName.length < 3 || fullName.length > 30) {
            return res.status(400).json({
                success: false,
                message: "Full name must be between 3 and 30 characters"
            });
        }
        const user = await User.findByIdAndUpdate(
            userId,
            { fullName },
            { new: true }
        ).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                userName: user.userName,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Old and new passwords are required" });
        }

        if (newPassword.length < 6 || newPassword.length > 20) {
            return res.status(400).json({ success: false, message: "New password must be 6–20 characters" });
        }

        const user = await User.findById(userId).select('password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordMatch) {
            return res.status(403).json({ success: false, message: "Old password is incorrect" });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ success: false, message: "New password must be different from old password" });
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
        user.password = await bcrypt.hash(newPassword, saltRounds);
        await user.save();

        return res.status(200).json({ success: true, message: "Password changed successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

