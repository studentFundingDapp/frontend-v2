// src/pages/Register.tsx

import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletAuth } from '../components/auth/WalletAuth';
import { useAuth } from '../components/auth/AuthContext';
import { studentAPI } from '../services/api';

export const Register: React.FC = () => {
  const { isAuthenticated, publicKey } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    institution: '',
    studyField: '',
    bio: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!publicKey) {
      setError('Please connect your Stellar wallet first.');
      return;
    }
    
    if (!isAuthenticated) {
      setError('Please authenticate with your wallet before creating a profile.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Submit profile data
      await studentAPI.createProfile({
        ...formData,
        publicKey
      });
      
      // Navigate to dashboard on success
      navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Create Student Profile</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="wallet-section">
          <h3>Connect Your Stellar Wallet</h3>
          <p>Your wallet address will be used to receive funding from donors.</p>
          
          <WalletAuth />
        </div>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="institution">Educational Institution</label>
            <input
              type="text"
              id="institution"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="studyField">Field of Study</label>
            <input
              type="text"
              id="studyField"
              name="studyField"
              value={formData.studyField}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio (Tell donors about yourself)</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !publicKey || !isAuthenticated}
            className="submit-button"
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>
        
        <div className="login-link">
          <p>Already have a profile? <a href="/login">Log in here</a></p>
        </div>
      </div>
    </div>
  );
};