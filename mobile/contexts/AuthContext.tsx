import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { storage } from '@/lib/storage';
import { config } from '@/lib/config';

// User type matching UniAuth
export interface User {
    id: string;
    email?: string;
    phone?: string;
    display_name?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

// Guest user mock data
const GUEST_USER: User = {
    id: 'guest-user-id',
    email: 'guest@morning.local',
    phone: '',
    display_name: '书友',
    avatar_url: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    isGuest: boolean;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
    loginAsGuest: () => void;
    setAuthData: (user: User, token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    accessToken: null,
    loading: true,
    isAuthenticated: false,
    isGuest: false,
    signOut: async () => { },
    refreshUser: async () => { },
    loginAsGuest: () => { },
    setAuthData: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGuest, setIsGuest] = useState(false);

    // Initialize auth state from storage
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = await storage.getUser<User>();
                const storedToken = await storage.getAccessToken();

                if (storedUser && storedToken) {
                    setUser(storedUser);
                    setAccessToken(storedToken);
                }
            } catch (error) {
                console.error('Failed to load auth state:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const signOut = useCallback(async () => {
        await storage.clear();
        setUser(null);
        setAccessToken(null);
        setIsGuest(false);
    }, []);

    const refreshUser = useCallback(async () => {
        if (isGuest) return;
        // TODO: Implement user refresh from API
    }, [isGuest]);

    const loginAsGuest = useCallback(() => {
        setUser(GUEST_USER);
        setIsGuest(true);
        setAccessToken(null);
    }, []);

    const setAuthData = useCallback(async (newUser: User, token: string) => {
        await storage.setUser(newUser);
        await storage.setAccessToken(token);
        setUser(newUser);
        setAccessToken(token);
        setIsGuest(false);
    }, []);

    const value = React.useMemo(
        () => ({
            user,
            accessToken,
            loading,
            isAuthenticated: !!user,
            isGuest,
            signOut,
            refreshUser,
            loginAsGuest,
            setAuthData,
        }),
        [user, accessToken, loading, isGuest, signOut, refreshUser, loginAsGuest, setAuthData]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};
