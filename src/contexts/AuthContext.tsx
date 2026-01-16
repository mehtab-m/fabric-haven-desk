import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock credentials
const ADMIN_EMAIL = 'zmhomefabrics@gmail.com';
const ADMIN_PASSWORD = 'zmhomefabrics@123';
const USER_EMAIL = 'mehtayaseen@gmail.com';
const USER_PASSWORD = 'mehtayaseen@123';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const login = (email: string, password: string) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser({
        id: 'admin-1',
        email: ADMIN_EMAIL,
        name: 'ZM Admin',
        role: 'admin'
      });
      setShowAuthModal(false);
      return { success: true };
    }

    if (email === USER_EMAIL && password === USER_PASSWORD) {
      setUser({
        id: 'user-1',
        email: USER_EMAIL,
        name: 'Yaseen Mehta',
        role: 'user'
      });
      setShowAuthModal(false);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const signup = (name: string, email: string, password: string) => {
    if (email === ADMIN_EMAIL || email === USER_EMAIL) {
      return { success: false, error: 'Email already exists' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    setUser({
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'user'
    });
    setShowAuthModal(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
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
        setAuthModalMode
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
