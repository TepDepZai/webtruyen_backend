import { PaperPoint } from "../models/paperPoint.js";
export const createPaperPoint = async (req, res) => {
    try {
        const { title, content, tags, img, author } = req.body;
        if (!title?.trim() || !content?.trim() || !tags?.trim() || !img?.trim() || !author?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Lacking information",
            });
        }
        const paperPoint = await PaperPoint.create({
            title,
            content,
            tags,
            img,
            author,
            createdByName: req.user.fullName,
            createdById: req.user._id,

        });
        return res.status(201).json({
            success: true,
            data: paperPoint,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi server",
        });
    }
};

export const getAllPaperPoints = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const paperPoints = await PaperPoint.find({ createdById: req.user._id });
        return res.status(200).json({
            success: true,
            paperPoints
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};
export const getPaperPointById = async (req, res) => {
    try {
        const paperPointId = req.params.paperPointId;
        const paperPoint = await PaperPoint.findById(paperPointId);
        return res.status(200).json({
            success: true,
            paperPoint
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
}
export const updatePaperPoint = async (req, res) => {
    try {
        const paperPointId = req.params.paperPointId;

        const { title, content, tags, img, author } = req.body
        const paperPoint = await PaperPoint.findByIdAndUpdate(paperPointId, { title, content, tags, img, author, createdByName: req.user.fullName }, { new: true })
        return res.status(200).json({
            success: true,
            paperPoint, message: "update true"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi server",
        });
    }
}
export const deletePaperPoint = async (req, res) => {
    try {
        const paperPointId = req.params.paperPointId;
        const paperPoint = await PaperPoint.findByIdAndDelete(paperPointId);
        if (!paperPoint) {
            return res.status(404).json({
                success: false,
                message: "PaperPoint not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Delete successful"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Lỗi server",
        });
    }
}