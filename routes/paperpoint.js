import express from "express"
import { createPaperPoint, deletePaperPoint, getAllPaperPoints, updatePaperPoint } from "../controllers/paperPoint.js";
import isAuthenticated from "../middleware/isauthenticated.js";
const router = express.Router();

router
    .route("/")
    .post(isAuthenticated, createPaperPoint)
    .get(getAllPaperPoints);
router
    .route("/:paperpointID")
    .put(isAuthenticated, updatePaperPoint)
    .delete(isAuthenticated, deletePaperPoint);

export default router;
