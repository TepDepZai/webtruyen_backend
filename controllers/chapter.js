import chapter from "../models/chapter.js";
import { PaperPoint } from "../models/paperPoint.js";

export const CreateChapter = async (req, res) => {
  try {
    const { content, chapterName, chapterNumber, createdByName, bookName, bookId } = req.body;

    if (!content || !chapterName || !chapterNumber || !createdByName || !bookName || !bookId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Kiểm tra chapterNumber có âm hay không
    if (typeof chapterNumber !== 'number' || chapterNumber <= 0) {
      return res.status(400).json({ error: "Chapter number must be a positive integer" });
    }
    // Check book có tồn tại không
    const book = await PaperPoint.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Check trùng số chương
    const existChapter = await chapter.findOne({
      BookId: bookId,
      ChapterNumber: chapterNumber,
    });
    if (existChapter) {
      return res.status(400).json({ error: "Chapter number already exists in this book" });
    }

    // Check trùng tên chương
    const existName = await chapter.findOne({
      BookId: bookId,
      ChapterName: chapterName,
    });
    if (existName) {
      return res.status(400).json({ error: "Chapter name already exists in this book" });
    }

    // Tạo chapter
    const newChapter = await chapter.create({
      ChapterContent: content,
      ChapterName: chapterName,
      ChapterNumber: chapterNumber,
      BookId: bookId,
      BookName: bookName,
      CreatedByName: createdByName,
    });

    // Cập nhật Book để thêm chapterId
    await PaperPoint.findByIdAndUpdate(bookId, {
      $push: {
        Chapter: newChapter._id,
      }
    });
    res.status(201).json({
      message: "Chapter created successfully",
      chapter: newChapter,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export const getAllChapters = async (req, res) => {
  try {
    const { bookId } = req.params;
    const chapters = await chapter.find({ BookId: bookId }).sort({ ChapterNumber: 1 });
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export const getChapterByIdAndNumber = async (req, res) => {
  try {
    const { id, number } = req.params;
    if (!id || !number) {
      return res.status(400).json({ error: "Chapter ID and number are required" });
    }
    const chapters = await chapter.find({ BookId: id }).sort({ ChapterNumber: 1 });
    // Lấy chương hiện tại
    const chapterData = await chapter.findOne({
      BookId: id,
      ChapterNumber: Number(number),
    });

    if (!chapterData) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    const prevChapter = await chapter
      .findOne({ BookId: id, ChapterNumber: { $lt: Number(number) } })
      .sort({ ChapterNumber: -1 }); 

    const nextChapter = await chapter
      .findOne({ BookId: id, ChapterNumber: { $gt: Number(number) } })
      .sort({ ChapterNumber: 1 });

    res.status(200).json({
      chapter: {
        chapterContent: chapterData.ChapterContent,
        chapterName: chapterData.ChapterName,
        chapterNumber: chapterData.ChapterNumber,
        bookName: chapterData.BookName,
      },
      prevChapter: prevChapter ? prevChapter.ChapterNumber : null,
      nextChapter: nextChapter ? nextChapter.ChapterNumber : null,
      chapterNumbers: chapters.map(ch => ch.ChapterNumber)
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Server error" });
  }
};

export const deleteChapter = async (req, res) => {
  try {
    const { id } = req.params;
    const { chapterId } = req.body;

    if (!chapterId) {
      return res.status(400).json({ error: "Chapter ID is required" });
    }
      if (!id) {
      return res.status(400).json({ error: "Book ID is required" });
    }
    

    // Xóa chapter
    const deletedChapter = await chapter.findByIdAndDelete(chapterId);
    if (!deletedChapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    // Cập nhật Book để xóa chapterId
    await PaperPoint.findByIdAndUpdate(id, {
      $pull: {
        Chapter: chapterId,
      }
    });
    res.status(200).json({
      message: "Chapter deleted successfully",
      chapter: deletedChapter,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
}
export const updateChapter = async (req, res) => {
  const { id } = req.params;
  const { chapterName, chapterNumber, content } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Chapter ID is required" });
  }

  try {
    const updatedChapter = await chapter.findByIdAndUpdate(id, {
      ChapterName: chapterName,
      ChapterNumber: chapterNumber,
      ChapterContent: content,
    }, { new: true });

    if (!updatedChapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    res.status(200).json({
      message: "Chapter updated successfully",
      chapter: updatedChapter,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server error" });
  }
}