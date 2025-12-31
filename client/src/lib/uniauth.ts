/**
 * UniAuth SSO Client
 * @description Singleton instance of UniAuth client for embedded login
 */
import { UniAuthClient, type UserInfo } from '@55387.ai/uniauth-client';
import { config } from './config';

const { baseUrl, clientId, clientSecret } = config.uniauth;

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
 * Use this to authenticate users via phone OTP or email/password
 */
export const uniauth = new UniAuthClient({
    baseUrl: baseUrl || '',
    appKey: clientSecret || undefined, // appKey is used for trusted client mode
    clientId: clientId || undefined,
});

// Re-export UserInfo type
export type UniAuthUser = UserInfo;
