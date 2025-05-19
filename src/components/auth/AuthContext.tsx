// src/components/auth/AuthContext.tsx

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User } from '../../types/stellar';
import { useStellarAuth } from '../../hooks/useStellarAuth';
import { studentAPI } from '../../services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  publicKey: string | null;
  connectWallet: () => Promise<void>;
  authenticate: () => Promise<boolean>;
  logout: () => void;
  getUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { 
    publicKey,
    isConnecting,
    isAuthenticated, 
    error, 
    connectWallet, 
    authenticate, 
    logout: stellarLogout 
  } = useStellarAuth();

  // Fetch user profile if authenticated
  const getUserProfile = async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      const userProfile = await studentAPI.getProfile();
      setUser(userProfile);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  // Check authentication status on mount and when isAuthenticated changes
  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated) {
        await getUserProfile();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };
    
    loadUserData();
  }, [isAuthenticated]);

  // Custom logout that clears user data
  const logout = () => {
    stellarLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading: isLoading || isConnecting,
      isAuthenticated,
      error,
      publicKey,
      connectWallet,
      authenticate,
      logout,
      getUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};