
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { uniauth, type UniAuthUser } from '@/lib/uniauth';

interface AuthContextType {
  user: UniAuthUser | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  loading: true,
  isAuthenticated: false,
  signOut: async () => { },
  refreshUser: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UniAuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state and subscribe to changes
  useEffect(() => {
    const initAuth = async () => {
        try {
            // Get initial state from SDK (Sync check first)
            const cachedUser = uniauth.getCachedUser();
            const token = uniauth.getAccessTokenSync();

            if (cachedUser && token) {
                setUser(cachedUser);
                setAccessToken(token);
            } else {
                // If sync check fails, try an async check (prevents logout on quick refresh)
                const freshUser = await uniauth.getCurrentUser().catch(() => null);
                if (freshUser) {
                    const freshToken = await uniauth.getAccessToken();
                    setUser(freshUser);
                    setAccessToken(freshToken);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    initAuth();

    // Subscribe to auth state changes from SDK
    const unsubscribe = uniauth.onAuthStateChange((newUser, isAuth) => {
      setUser(newUser);
      setAccessToken(isAuth ? uniauth.getAccessTokenSync() : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    await uniauth.logout();
    setAccessToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const freshUser = await uniauth.getCurrentUser();
    const token = uniauth.getAccessTokenSync();
    setUser(freshUser);
    setAccessToken(token);
  }, []);

  const value = React.useMemo(() => ({
    user,
    accessToken,
    loading,
    isAuthenticated: !!user,
    signOut,
    refreshUser,
  }), [user, accessToken, loading, signOut, refreshUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
