// src/components/auth/WalletAuth.tsx

import React from 'react';
import { useAuth } from './AuthContext';

interface WalletAuthProps {
  onAuthSuccess?: () => void;
}

export const WalletAuth: React.FC<WalletAuthProps> = ({ onAuthSuccess }) => {
  const { 
    publicKey, 
    isLoading, 
    isAuthenticated, 
    error, 
    connectWallet, 
    authenticate 
  } = useAuth();

  // Handle wallet connection and authentication
  const handleAuthFlow = async () => {
    if (!publicKey) {
      await connectWallet();
    } else if (!isAuthenticated) {
      const success = await authenticate();
      if (success && onAuthSuccess) {
        onAuthSuccess();
      }
    }
  };

  return (
    <div className="wallet-auth">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="wallet-status">
        {publicKey ? (
          <div className="connected">
            <div className="status-dot connected"></div>
            <span>Wallet Connected:</span>
            <span className="public-key">
              {publicKey.substring(0, 6)}...{publicKey.substring(publicKey.length - 6)}
            </span>
          </div>
        ) : (
          <div className="not-connected">
            <div className="status-dot not-connected"></div>
            <span>No Wallet Connected</span>
          </div>
        )}
      </div>
      
      <button 
        className="wallet-button"
        onClick={handleAuthFlow}
        disabled={isLoading}
      >
        {isLoading ? (
          <span>Processing...</span>
        ) : !publicKey ? (
          <span>Connect Stellar Wallet</span>
        ) : !isAuthenticated ? (
          <span>Authenticate with Wallet</span>
        ) : (
          <span>Wallet Connected</span>
        )}
      </button>
      
      {publicKey && !isAuthenticated && (
        <p className="auth-note">
          Please authenticate with your wallet to continue.
        </p>
      )}
    </div>
  );
};