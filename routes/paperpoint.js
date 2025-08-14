import express from "express"
import { createPaperPoint, deletePaperPoint, getAllPaperPoints, getPaperPointById, updatePaperPoint } from "../controllers/paperPoint.js";
import isAuthenticated from "../middleware/isauthenticated.js";
const router = express.Router();

router.route("/createbook").post(isAuthenticated, createPaperPoint)
router.route("/getAllBooks").get(isAuthenticated, getAllPaperPoints);
router.route("/getBookById/:paperPointId").get(isAuthenticated, getPaperPointById);
router.route("/updateBook/:paperPointId").put(isAuthenticated, updatePaperPoint);
router.route("/deleteBook/:paperPointId").delete(isAuthenticated, deletePaperPoint);
export default router;
