#!/usr/bin/env node
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import profileRouter from "./routes/profile";
import communityRouter from "./routes/community";
import tasksRouter from "./routes/tasks";
import achievementsRouter from "./routes/achievements";
import aiRouter from "./routes/ai";
import chatRouter from "./routes/chat";
import progressRouter from "./routes/progress";
import checkinsRouter from "./routes/checkins.js";
import relationshipsRouter from "./routes/relationships.js";
import errorsRouter from "./routes/errors.js";
import matchRouter from "./routes/match.js";
import shopRouter from "./routes/shop.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();
app.use(cors({ origin: process.env.DEV_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Health Check
app.get("/health", (_req: Request, res: Response) => res.json({ status: "ok" }));

// API Routing
app.use("/api/profile", profileRouter);
app.use("/api/posts", communityRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/achievements", achievementsRouter);
app.use("/api/genai", aiRouter);
app.use("/api/chat", chatRouter);
app.use("/api/progress", progressRouter);
app.use("/api/checkins", checkinsRouter);
app.use("/api/relationships", relationshipsRouter);
app.use("/api/errors", errorsRouter);
app.use("/api/match", matchRouter);
app.use("/api/shop", shopRouter);

app.listen(PORT, () =>
  console.log(`BFF (TypeScript) Service listening on http://localhost:${PORT}`)
);