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
export const getBookById = async (req, res) => {
    const { id } = req.params;
    let author = false;

    try {
        const book = await PaperPoint.findById(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }
        if (req.user && String(req.user._id) === String(book.createdById)) {
            author = true;
            
        }
        return res.status(200).json({
            success: true,
            author,
            book
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};

