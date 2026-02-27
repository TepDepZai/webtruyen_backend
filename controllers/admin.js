import { PaperPoint } from "../models/paperPoint.js";
import { getBooksPaginated, getUsersPaginated } from "../services/adminService.js";

export const getBookAdmin = async (req, res) => {
  try {
    const result = await getBooksPaginated(req.query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || "Server error" 
    });
  }
};
export const getUsersAdmin = async (req, res) => {
    try {
        const result = await getUsersPaginated(req.query);
        res.status(200).json(result);
    } catch (error) {
        console.error("getUsersAdmin error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
export const deleteBookAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await PaperPoint.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Server error"
    });
  }
};
export const updateBookAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedBook = await PaperPoint.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }
    res.status(200).json({ success: true, book: updatedBook });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Server error"
    });
  }
};