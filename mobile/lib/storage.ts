import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER: 'user',
} as const;

export const storage = {
    async getAccessToken(): Promise<string | null> {
        return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    async setAccessToken(token: string): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    },

    async getRefreshToken(): Promise<string | null> {
        return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },

    async setRefreshToken(token: string): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    },

    async getUser<T>(): Promise<T | null> {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        return data ? JSON.parse(data) : null;
    },

    async setUser<T>(user: T): Promise<void> {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    },

    async clear(): Promise<void> {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.ACCESS_TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER,
        ]);
    },
};
