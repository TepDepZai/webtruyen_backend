import { PaperPoint } from "../models/paperPoint.js"; 

export const getBookAdmin = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const size = Math.max(1, parseInt(req.query.size) || 9);
    const search = req.query.search?.trim() || ""; 

    const filter = search
      ? {
          $or: [
            { title: { $regex: `^${search}`, $options: "i" } },
          ],
        }
      : {};
    const totalItems = await PaperPoint.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalItems / size));

    const books = await PaperPoint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(size);

    res.status(200).json({
      success: true,
      books,
      pagination: {
        total: totalItems,
        page,
        size,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || "Server error" 
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