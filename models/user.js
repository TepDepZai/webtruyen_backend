import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    totalRead: {
        type: Number,
        default: 0
    },
    favorites: {
        type: Number,
        default: 0
    },
    currentlyReading: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})

export const User = mongoose.model("User", userSchema)