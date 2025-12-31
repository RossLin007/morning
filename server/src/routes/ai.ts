import express, { Response } from "express";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { authenticateUser, AuthRequest } from "../middleware/auth";

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
  const { prompt, systemInstruction, history } = req.body;
  
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      // Fix: Ensure systemInstruction follows the expected type structure or use a simpler string
      systemInstruction: systemInstruction ? { role: "system", parts: [{ text: systemInstruction }] } as Content : undefined
    });

    let result;
    if (history && Array.isArray(history)) {
      const chat = model.startChat({ history });
      result = await chat.sendMessage(prompt);
    } else {
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    return res.json({ text: response.text() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;