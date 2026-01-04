// Centralized Configuration for React Native
// Adapted from Web version

// In React Native, we use expo-constants for environment variables
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const config = {
    app: {
        name: "凡人晨读",
        version: "v2.8.0",
    },
    api: {
        // Backend API URL
        baseUrl: extra.API_BASE_URL ?? "https://morning.829525.xyz/api",
    },
    uniauth: {
        // UniAuth SSO Configuration
        baseUrl: extra.UNIAUTH_BASE_URL ?? "",
        clientId: extra.UNIAUTH_CLIENT_ID ?? "",
    },
    ai: {
        apiKey: extra.GEMINI_API_KEY ?? "",
        defaultModel: "gemini-2.5-flash",
    },
    features: {
        enableRealtime: false,
        enableGamification: true,
    },
};
