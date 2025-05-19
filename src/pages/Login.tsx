// src/pages/Login.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletAuth } from '../components/auth/WalletAuth';
import { useAuth } from '../components/auth/AuthContext';

export const Login: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Handle successful authentication
  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="login-page">
      <div className="auth-container">
        <h1>Student Funding Platform</h1>
        <h2>Login with Stellar</h2>
        
        <div className="auth-description">
          <p>
            Connect your Stellar wallet to access the student funding platform.
            You'll be able to showcase your projects and receive funding from donors.
          </p>
        </div>
        
        <WalletAuth onAuthSuccess={handleAuthSuccess} />
        
        <div className="register-prompt">
          <p>New to the platform?</p>
          <button 
            className="register-button"
            onClick={() => navigate('/register')}
          >
            Create Student Profile
          </button>
        </div>
      </div>
    </div>
  );
};