
import { UniAuthServer } from '@55387.ai/uniauth-server';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we look at the project root for .env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

if (!process.env.VITE_UNIAUTH_BASE_URL) {
    console.warn("⚠️ Warning: VITE_UNIAUTH_BASE_URL is not defined in backend process.env");
}

export const uniauthServer = new UniAuthServer({
  baseUrl: process.env.VITE_UNIAUTH_BASE_URL || 'https://sso.55387.xyz',
  clientId: process.env.VITE_UNIAUTH_CLIENT_ID || '',
  clientSecret: process.env.VITE_UNIAUTH_CLIENT_SECRET || '',
});
