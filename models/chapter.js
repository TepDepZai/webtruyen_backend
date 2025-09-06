import mongoose from "mongoose";

const DOCUMENT_NAME = "Chapter";
const COLLECTION_NAME = "Chapters";

const ChapterSchema = new mongoose.Schema(
  {
    ChapterName: {
      type: String,
      required: true,
    },
    ChapterContent: {
      type: String,
      required: true,
    },
    ChapterNumber: {
      type: Number,
      required: true,
    },
    BookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaperPoint",
      required: true,
    },
    BookName: {
      type: String,
      required: true,
    },
    CreatedByName: {
      type: String,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

export default mongoose.model(DOCUMENT_NAME, ChapterSchema);
