import { PaperPoint } from "../models/paperPoint.js";

export const getAllBooks = async (req, res) => {
    try {
        // Lấy page và size từ query (nếu không có thì mặc định)
        const page = parseInt(req.query.page) || 1;
        const size = parseInt(req.query.size) || 10;

        // Đếm tổng số sách
        const totalItems = await PaperPoint.countDocuments({});
        const totalPages = Math.ceil(totalItems / size);

        // Query dữ liệu theo trang
        const books = await PaperPoint.find({})
            .populate({
                path: "Chapter",
                select: "ChapterNumber createdAt",
                options: { sort: { ChapterNumber: -1 } }
            })
            .skip((page - 1) * size)
            .limit(size);

        return res.status(200).json({
            success: true,
            books,
            pagination: {
                page,
                size,
                total_pages: totalPages,
                has_prev: page > 1,
                has_next: page < totalPages,
            }
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
        const book = await PaperPoint.findById(id).populate({
            path: "Chapter",
            select: "ChapterName ChapterNumber createdAt",
            options: { sort: { ChapterNumber: -1 } }
        });

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

export const ItemRollBar = async (req, res) => {
  try {
    const books = await PaperPoint.find({ roleBar: true })
      .select("title img chapterNumber")
      .populate({
                path: "Chapter",
                select: "ChapterNumber",
                options: { sort: { ChapterNumber: -1 } }
            })
      .limit(8);

    return res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
