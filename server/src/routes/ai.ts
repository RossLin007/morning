import express, { Response } from "express";
import { GoogleGenAI, Content } from "@google/genai";
import { authenticateUser, AuthRequest } from "../middleware/auth.js";

const router = express.Router();

// Initialize with new SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Helper to build contents array
const buildContents = (prompt: string, history?: any[]): Content[] => {
  const contents: Content[] = [];
  if (history && Array.isArray(history)) {
    contents.push(...history);
  }
  contents.push({
    role: "user",
    parts: [{ text: prompt }],
  });
  return contents;
};

// Non-streaming endpoint (kept for backwards compatibility)
router.post("/", authenticateUser, async (req: AuthRequest, res: Response) => {
  const { prompt, systemInstruction, history } = req.body;

  try {
    const contents = buildContents(prompt, history);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: systemInstruction ? { systemInstruction } : undefined,
    });

    return res.json({ text: response.text });
  } catch (err: any) {
    console.error("❌ AI Generation Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// Streaming endpoint using Vercel AI SDK protocol
router.post("/stream", authenticateUser, async (req: AuthRequest, res: Response) => {
  // Support both new standard 'messages' and legacy 'prompt/history'
  const { messages, prompt, systemInstruction, history } = req.body;

  try {
    let contents: Content[] = [];
    let sysInstruction = systemInstruction;

    if (messages && Array.isArray(messages)) {
      // Conversion from Vercel AI SDK Standard Message format to Google GenAI format
      contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Extract system message if present
      const systemMessage = messages.find((m: any) => m.role === 'system');
      if (systemMessage) {
        sysInstruction = systemMessage.content;
        contents = contents.filter((m: any) => m.role !== 'system');
      }
    } else {
      // Legacy fallback
      contents = buildContents(prompt, history);
    }

    // Manual implementation of Vercel AI Data Stream Protocol
    // 0: Text part
    // https://sdk.vercel.ai/docs/reference/stream-helpers/stream-data#data-stream-protocol

    // Set headers for data stream
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Vercel-AI-Data-Stream', 'v1');
    res.flushHeaders();

    try {
      const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents,
        config: sysInstruction ? { systemInstruction: sysInstruction } : undefined,
      });

      for await (const chunk of response) {
        if (chunk.text) {
          // Protocol: 0:{string}\n
          res.write(`0:${JSON.stringify(chunk.text)}\n`);
        }
      }
      res.end();

    } catch (err: any) {
      console.error("❌ AI Stream Error:", err.message);
      // Fallback: end stream
      res.end();
    }

  } catch (err: any) {
    console.error("❌ AI Stream Setup Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;