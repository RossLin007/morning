#!/usr/bin/env node
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Routes
import profileRouter from "./routes/profile.js";
import communityRouter from "./routes/community.js";
import tasksRouter from "./routes/tasks.js";
import achievementsRouter from "./routes/achievements.js";
import aiRouter from "./routes/ai.js";
import chatRouter from "./routes/chat.js";
import progressRouter from "./routes/progress.js";
import checkinsRouter from "./routes/checkins.js";
import relationshipsRouter from "./routes/relationships.js";
import errorsRouter from "./routes/errors.js";
import matchRouter from "./routes/match.js";
import shopRouter from "./routes/shop.js";

// Middleware
import { errorHandler } from "./middleware/errorHandler.js";
import { RateLimiters } from "./middleware/rateLimit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log startup context for debugging
console.log("🚀 Server starting...");

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();

// CORS Configuration with whitelist validation
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : [];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.) in dev mode
    if (!origin) {
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, false);
    }

    // Check against whitelist
    if (allowedOrigins.length === 0 && process.env.NODE_ENV !== 'production') {
      // Dev mode: allow all origins if no whitelist configured
      console.warn("⚠️ [CORS] No ALLOWED_ORIGINS configured. Allowing all origins (dev mode only).");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Log rejected origin in production for debugging
    if (process.env.NODE_ENV === 'production') {
      console.warn(`⚠️ [CORS] Blocked origin: ${origin}`);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Health Check
app.get("/health", (_req: Request, res: Response) => res.json({ status: "ok" }));

// API Routing
app.use("/api/profile", profileRouter);
app.use("/api/posts", communityRouter);
app.use("/api/tasks", tasksRouter);
app.use("/api/achievements", achievementsRouter);
app.use("/api/genai", RateLimiters.ai, aiRouter); // Rate limited
app.use("/api/chat", chatRouter);
app.use("/api/progress", progressRouter);
app.use("/api/checkins", checkinsRouter);
app.use("/api/relationships", relationshipsRouter);
app.use("/api/errors", errorsRouter);
app.use("/api/match", matchRouter);
app.use("/api/shop", shopRouter);

// --- Production: Static Assets ---
const clientDistPath = path.resolve(__dirname, "../../client/dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Fallback Middleware: All non-API routes serve index.html (SPA support)
// Using a standard middleware instead of app.get('*') to avoid Express 5 PathErrors
app.use((req: Request, res: Response) => {
  if (!req.path.startsWith("/api")) {
    const indexPath = path.join(clientDistPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Frontend not build or not found");
    }
  } else {
    res.status(404).json({ error: "API not found" });
  }
});

// Global Error Handler (must be last middleware)
app.use(errorHandler);

app.listen(Number(PORT), "0.0.0.0", () =>
  console.log(`BFF (TypeScript) Service listening on port ${PORT}`)
);