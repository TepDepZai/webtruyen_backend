import mongoose from "mongoose";

const PaperPointSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200
    },
    roleBar: {
      type: Boolean,
      default: false
    },
    slug: {
      type: String,
      index: true,
      unique: true
    },
    img: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: true,
      minlength: 10,
      maxLength: 20000
    },
    author: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: []
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },
    createdById: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdByName: {
    type: String,
    trim: true,
    required: true
  },
Chapter: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter"
  }
],
  },
  {
    timestamps: true,
    collection: "paper_points",
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
  
);
PaperPointSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

export const PaperPoint =  mongoose.models.PaperPoint || mongoose.model("PaperPoint", PaperPointSchema);