import express, { Response } from "express";
import { GoogleGenAI, Content } from "@google/genai";
import { authenticateUser, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Initialize with new SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
  const { prompt, systemInstruction, history } = req.body;

  try {
    // Build contents array for chat-style generation
    const contents: Content[] = [];

    // Add history if provided
    if (history && Array.isArray(history)) {
      contents.push(...history);
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: prompt }],
    });

    // Generate content with new SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: systemInstruction ? {
        systemInstruction: systemInstruction,
      } : undefined,
    });

    return res.json({ text: response.text });
  } catch (err: any) {
    console.error("❌ AI Generation Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;