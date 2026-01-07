
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { uniauth, type UniAuthUser } from '@/lib/uniauth';

// Guest user mock data
const GUEST_USER: UniAuthUser = {
  id: 'guest-user-id',
  email: 'guest@morning.local',
  phone: '',
  nickname: '书友',
  avatar_url: '',
};

// Dev test account (no verification needed)
const DEV_TEST_PHONE = '13800000000';
const DEV_TEST_CODE = '123456';

interface AuthContextType {
  user: UniAuthUser | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginAsGuest: () => void;
  loginAsDev: () => void;
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
  loginAsDev: () => { },
});

// Storage keys
const GUEST_MODE_KEY = 'mr_guest_mode';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UniAuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Initialize auth state and subscribe to changes
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if guest mode is active
        const guestMode = localStorage.getItem(GUEST_MODE_KEY);
        if (guestMode === 'true') {
          setUser(GUEST_USER);
          setIsGuest(true);
          setLoading(false);
          return;
        }

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
    const unsubscribe = uniauth.onAuthStateChange((newUser: UniAuthUser | null, isAuth: boolean) => {
      if (!isGuest) {
        setUser(newUser);
        setAccessToken(isAuth ? uniauth.getAccessTokenSync() : null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isGuest]);

  const signOut = useCallback(async () => {
    if (isGuest) {
      localStorage.removeItem(GUEST_MODE_KEY);
      setIsGuest(false);
    } else {
      await uniauth.logout();
    }
    setAccessToken(null);
    setUser(null);
  }, [isGuest]);

  const refreshUser = useCallback(async () => {
    if (isGuest) return;
    const freshUser = await uniauth.getCurrentUser();
    const token = uniauth.getAccessTokenSync();
    setUser(freshUser);
    setAccessToken(token);
  }, [isGuest]);

  // Login as guest (no authentication needed)
  const loginAsGuest = useCallback(() => {
    localStorage.setItem(GUEST_MODE_KEY, 'true');
    setUser(GUEST_USER);
    setIsGuest(true);
    setAccessToken(null);
  }, []);

  // Login as dev test account (bypass verification)
  const loginAsDev = useCallback(() => {
    const devUser: UniAuthUser = {
      id: 'dev-test-user-id',
      email: 'dev@morning.local',
      phone: DEV_TEST_PHONE,
      nickname: '开发测试',
      avatar_url: '',
    };
    localStorage.setItem(GUEST_MODE_KEY, 'dev');
    setUser(devUser);
    setIsGuest(false); // Dev mode is not guest mode
    setAccessToken('dev-test-token');
  }, []);

  const value = React.useMemo(() => ({
    user,
    accessToken,
    loading,
    isAuthenticated: !!user,
    isGuest,
    signOut,
    refreshUser,
    loginAsGuest,
    loginAsDev,
  }), [user, accessToken, loading, isGuest, signOut, refreshUser, loginAsGuest, loginAsDev]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

// Export test credentials for Login page
export const DEV_CREDENTIALS = {
  phone: DEV_TEST_PHONE,
  code: DEV_TEST_CODE,
};
