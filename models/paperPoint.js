import mongoose from "mongoose";

const PaperPointSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
})

export const PaperPoint = mongoose.model("PaperPoint",PaperPointSchema)