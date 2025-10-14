import { GoogleGenerativeAI } from "@google/generative-ai";
import { translateStory } from "../services/aiService.js";

export const AIChatBot = async (req, res) => {
  try {
    const { prompt } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const answer = result.response.text();
    return res.json({ answer });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const AISmooth = async (req, res) => {
  try {
    const { content, language, title } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Missing content" });
    }
    const answer = await translateStory(content, language, title);
    return res.json({ answer });
  } catch (error) {
    console.error("AI translation error:", error);
    return res.status(500).json({ message: error.message });
  }
};
