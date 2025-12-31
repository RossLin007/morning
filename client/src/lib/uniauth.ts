/**
 * UniAuth SSO Client
 * @description Singleton instance of UniAuth client for public OAuth flow (PKCE)
 */
import { UniAuthClient, type UserInfo } from '@55387.ai/uniauth-client';
import { config } from './config';

const { baseUrl, clientId } = config.uniauth;

// Validate configuration in production
if (!baseUrl || !clientId) {
    const msg = '[UniAuth] Missing VITE_UNIAUTH_BASE_URL or VITE_UNIAUTH_CLIENT_ID. Running in demo/offline mode.';
    if (import.meta.env.PROD) {
        throw new Error(msg);
    } else {
        console.warn(msg);
    }
}

/**
 * UniAuth client instance
 * Uses public OAuth flow (no client secret required)
 */
export const uniauth = new UniAuthClient({
    baseUrl: baseUrl || '',
    clientId: clientId || undefined,
    // Note: appKey (client secret) removed for security
    // The SDK should use PKCE flow for public clients
});

// Re-export UserInfo type
export type UniAuthUser = UserInfo;
