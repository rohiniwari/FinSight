import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children, queryClient }) {
  const [user,    setUser]    = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  // Verify session on mount
  useEffect(() => {
    const verify = async () => {
      if (authService.isAuthenticated()) {
        try {
          const fresh = await authService.getMe();
          setUser(fresh);
          localStorage.setItem('fs_user', JSON.stringify(fresh));
        } catch (err) {
          // Try to refresh before giving up
          try {
            await authService.refreshToken();
            const fresh = await authService.getMe();
            setUser(fresh);
            localStorage.setItem('fs_user', JSON.stringify(fresh));
          } catch (_) {
            await authService.logout();
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    verify();
  }, []);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    // Clear old cache on successful login
    if (queryClient) await queryClient.clear();
    return data;
  }, [queryClient]);

  const register = useCallback(async (payload) => {
    const data = await authService.register(payload);
    setUser(data.user);
    // Clear old cache on successful registration
    if (queryClient) await queryClient.clear();
    return data;
  }, [queryClient]);

  const loginWithGoogle = useCallback(async () => {
    return authService.loginWithGoogle();
  }, []);

  const handleOAuthCallback = useCallback(async () => {
    const data = await authService.handleOAuthCallback();
    setUser(data.user);
    // Clear old cache on successful OAuth
    if (queryClient) await queryClient.clear();
    return data;
  }, [queryClient]);

  const verifyOtp = useCallback(async ({ email, token }) => {
    const data = await authService.verifyOtp({ email, token });
    setUser(data.user);
    // Clear old cache on successful OTP verification
    if (queryClient) await queryClient.clear();
    return data;
  }, [queryClient]);

  const logout = useCallback(async () => {
    // Clear all cached queries
    if (queryClient) await queryClient.clear();
    await authService.logout();
    setUser(null);
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{
      user, loading,
      login, register, logout,
      loginWithGoogle, handleOAuthCallback, verifyOtp,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
