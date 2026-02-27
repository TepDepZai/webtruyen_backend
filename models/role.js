import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        enum: ["Guest", "User", "Author", "Moderator", "Admin", "SuperAdmin"],
        maxlength: 50
    },
    description: {
        type: String,
        required: false,
        trim: true,
        maxlength: 200
    },
    permissions: {
        type: [String],
        default: [],
        // Permissions có thể có: read, comment, follow, favorite, create_book, edit_book, delete_book, moderate, manage_users, manage_roles
    },
    priority: {
        type: Number,
        required: true,
        default: 0,
        // Lower number = higher priority (SuperAdmin = 0, Guest = 100)
    },
    isActive: {
        type: Boolean,
        default: true
    },
    totalUsers: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

export const Role = mongoose.model("Role", roleSchema)