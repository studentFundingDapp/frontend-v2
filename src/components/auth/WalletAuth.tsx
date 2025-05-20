// src/components/auth/WalletAuth.tsx
import React from 'react';
import { useAuth } from './AuthContext';

export const WalletAuth: React.FC<{ onAuthSuccess?: () => void }> = ({ onAuthSuccess }) => {
  const { loginWithWallet, publicKey, isAuthenticated } = useAuth();

  const handleConnectWallet = async () => {
    try {
      const success = await loginWithWallet(); // trigger wallet login flow
      if (success && onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {isAuthenticated && publicKey ? (
        <div className="text-green-600 font-medium">
          Wallet Connected: {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
        </div>
      ) : (
        <button
          onClick={handleConnectWallet}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Connect Stellar Wallet
        </button>
      )}
    </div>
  );
};
