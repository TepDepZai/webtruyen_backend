import { PaperPoint } from "../models/PaperPoint.js";

export const createPaperPoint = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",
            });

        }
        const paperPoint = new PaperPoint({ title, description });
        paperPoint.save();
        return res.status(201).json({
            success: true,
            message: "PaperPoint created."

        })
    } catch (error) {
        console.log("CreatePaperPoint error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export const getAllPaperPoints = async (req, res) => {
    try {
        const paperPoints = await PaperPoint.find({});
        console.log(paperPoints);

        return res.status(200).json({
            success: true,
            paperPoints: paperPoints.length === 0 ? [] : paperPoints
        })

    } catch (error) {
        console.log(error);


    }
}
export const updatePaperPoint = async (req, res) => {
    try {
        const paperpointID = req.params.paperpointID;

        const { title } = req.body
        console.log(title);

        // const paperpoint = await PaperPoint.findById(paperpointID);
        const paperPoint = await PaperPoint.findByIdAndUpdate(paperpointID, { title }, { new: true })
        return res.status(200).json({
            success: true,
            paperPoint, message: "update true"
        })
    } catch (error) {

    }
}
export const deletePaperPoint = async (req, res) => {
    try {
        const paperpointID = req.params.paperpointID;

        const paperPoint = await PaperPoint.findByIdAndDelete(paperpointID, { title }, { new: true })
        return res.status(200).json({
            success: true,
            paperPoint, message: "delete true"
        })


    } catch (error) {

    }
}