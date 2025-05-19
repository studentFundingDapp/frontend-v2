// src/hooks/useStellarAuth.ts

import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

// Interface for the hook's return value
export interface StellarAuthHook {
  publicKey: string | null;
  isConnecting: boolean;
  isAuthenticated: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  authenticate: () => Promise<boolean>;
  logout: () => void;
}

export const useStellarAuth = (): StellarAuthHook => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if auth token exists on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      const savedPublicKey = localStorage.getItem('stellarPublicKey');
      
      if (token && savedPublicKey) {
        try {
          // Verify the token with your backend
          const { valid } = await authAPI.verifyToken();
          
          if (valid) {
            setPublicKey(savedPublicKey);
            setIsAuthenticated(true);
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('stellarPublicKey');
          }
        } catch (err) {
          console.error('Auth verification error:', err);
        }
      }
    };
    
    checkAuth();
  }, []);

  // Step 1: Connect to Stellar wallet
  const connectWallet = async (): Promise<void> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Check if Freighter is installed
      if (!window.freighter) {
        setError('Stellar wallet not detected. Please install Freighter extension.');
        return;
      }
      
      // Check if wallet is connected
      const isConnected = await window.freighter.isConnected();
      if (!isConnected) {
        setError('Please unlock your Freighter wallet and try again.');
        return;
      }
      
      // Get public key
      const userPublicKey = await window.freighter.getPublicKey();
      setPublicKey(userPublicKey);
      
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  // Step 2: Authenticate with backend using wallet signature
  const authenticate = async (): Promise<boolean> => {
    if (!publicKey) {
      setError('Wallet not connected. Please connect your wallet first.');
      return false;
    }
    
    setIsConnecting(true);
    setError(null);
    
    try {
      // 1. Request challenge from your backend
      const { challenge } = await authAPI.getChallenge(publicKey);
      
      // 2. Sign the challenge with wallet
      const { signedMessage } = await window.freighter!.signMessage(challenge);
      
      // 3. Send signature to backend for verification
      const authData = await authAPI.verifyWallet(publicKey, challenge, signedMessage);
      
      // 4. Store authentication token
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('stellarPublicKey', publicKey);
      setIsAuthenticated(true);
      
      return true;
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('stellarPublicKey');
    setPublicKey(null);
    setIsAuthenticated(false);
  };

  return {
    publicKey,
    isConnecting,
    isAuthenticated,
    error,
    connectWallet,
    authenticate,
    logout
  };
};
https://app.getpostman.com/join-team?invite_code=142531e8ecb81e79d3be60004bdc9a1fe4a9fe90229cfba90e66a0dcc31179d3