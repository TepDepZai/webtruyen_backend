import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildAIPrompt } from "../utils/aiPrompt.js";

export const translateStory = async (content, language, title) => {
  const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = buildAIPrompt(content, language, title);
  const result = await model.generateContent(prompt);
  return result.response.text();
};
