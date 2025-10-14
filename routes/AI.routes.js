import express from "express";
import isAuthenticated from "../middleware/isauthenticated.js";
import { AIChatBot, AISmooth } from "../controllers/AI.controller.js";

const router = express.Router();

router.post("/AIChatBot", isAuthenticated, AIChatBot)
router.post("/AISmooth", isAuthenticated, AISmooth)
export default router;