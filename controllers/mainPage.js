import { PaperPoint } from "../models/paperPoint.js";

export const getAllBooks = async (req, res) => {
    try {
        const books = await PaperPoint.find({});
        return res.status(200).json({
            success: true,
            books
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
}