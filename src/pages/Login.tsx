// src/pages/Login.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletAuth } from '../components/auth/WalletAuth';
import { useAuth } from '../components/auth/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Student Funding Platform
        </h1>
        <h2 className="text-lg font-semibold text-center text-gray-700 mt-2">
          Login with Stellar Wallet
        </h2>

        <p className="text-sm text-gray-500 text-center mt-4">
          Connect your Freighter wallet to access the platform, showcase your profile, and receive donations from verified donors.
        </p>

        <div className="mt-6">
          <WalletAuth onAuthSuccess={handleAuthSuccess} />
        </div>

        {isLoading && (
          <p className="text-sm text-gray-400 text-center mt-4">Authenticating...</p>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            New to the platform?
          </p>
          <button
            onClick={() => navigate('/register')}
            className="mt-2 px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Create Student Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
