// src/components/auth/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  publicKey: string | null;
  isAuthenticated: boolean;
  loginWithWallet: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  publicKey: null,
  isAuthenticated: false,
  loginWithWallet: async () => false,
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const loginWithWallet = async (): Promise<boolean> => {
    try {
      if (window.freighterApi) {
        const key = await window.freighterApi.getPublicKey();
        setPublicKey(key);
        return true;
      } else {
        alert("Please install the Freighter wallet extension.");
        return false;
      }
    } catch (error) {
      console.error("Wallet login error:", error);
      return false;
    }
  };

  const logout = () => {
    setPublicKey(null);
  };

  return (
    <AuthContext.Provider
      value={{
        publicKey,
        isAuthenticated: !!publicKey,
        loginWithWallet,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
