import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  isLoading: boolean;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyPin: (email: string, pin: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string, newPassword: string, pin: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
      };
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setShowAuthModal(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register({ name, email, password });
      const userData: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
      };
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setShowAuthModal(false);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Signup failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authAPI.forgotPassword({ email });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send reset code' };
    }
  };

  const verifyPin = async (email: string, pin: string) => {
    try {
      await authAPI.verifyPin({ email, pin });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Invalid or expired code' };
    }
  };

  const resetPassword = async (email: string, newPassword: string, pin: string) => {
    try {
      await authAPI.resetPassword({ email, newPassword, pin });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to reset password' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        isLoading,
        forgotPassword,
        verifyPin,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
