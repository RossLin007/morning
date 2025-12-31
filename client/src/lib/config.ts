// Centralized Configuration
// This replaces scattered env calls and hardcoded strings

export const config = {
  app: {
    name: "凡人晨读",
    version: "v2.8.0",
  },
  uniauth: {
    // UniAuth SSO Configuration - requires trusted_client grant type
    baseUrl: import.meta.env.VITE_UNIAUTH_BASE_URL ?? "",
    clientId: import.meta.env.VITE_UNIAUTH_CLIENT_ID ?? "",
    clientSecret: import.meta.env.VITE_UNIAUTH_CLIENT_SECRET ?? "",
  },
  ai: {
    // Support both API_KEY and GEMINI_API_KEY for compatibility
    apiKey: import.meta.env.VITE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "",
    defaultModel: "gemini-2.5-flash",
  },
  features: {
    enableRealtime: false, // Disabled due to removal of direct Supabase access
    enableGamification: true,
  },
};