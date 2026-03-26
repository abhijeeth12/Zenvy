import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../api';

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  avatarUrl?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginState: (token: string, userData: User) => void;
  logoutState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const token = localStorage.getItem('zenvy_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiClient.get<User>('/auth/me');
      setUser(data);
    } catch (err) {
      console.error('Failed to restore session:', err);
      // Let the apiClient interceptor handle token clearing if it was a 401
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Listen for the forceful logout event expelled by our API interceptor (api.ts)
    const handleForceLogout = () => {
      setUser(null);
    };
    window.addEventListener('zenvy:logout', handleForceLogout);
    return () => window.removeEventListener('zenvy:logout', handleForceLogout);
  }, []);

  const loginState = (token: string, userData: User) => {
    localStorage.setItem('zenvy_token', token);
    setUser(userData);
  };

  const logoutState = () => {
    localStorage.removeItem('zenvy_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginState, logoutState }}>
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
