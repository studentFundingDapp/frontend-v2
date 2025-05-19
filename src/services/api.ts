// src/services/api.ts

import { AuthResponse, ChallengeResponse, User } from '../types/stellar';

const API_URL = '/api'; // Replace with your actual API URL in production

// Helper function for making API requests
async function fetchWithAuth(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

// Auth API calls
export const authAPI = {
  // Request authentication challenge
  getChallenge: async (publicKey: string): Promise<ChallengeResponse> => {
    return fetchWithAuth('/auth/challenge', {
      method: 'POST',
      body: JSON.stringify({ publicKey })
    });
  },
  
  // Verify signature and authenticate
  verifyWallet: async (
    publicKey: string, 
    challenge: string, 
    signature: string
  ): Promise<AuthResponse> => {
    return fetchWithAuth('/auth/wallet-verify', {
      method: 'POST',
      body: JSON.stringify({ publicKey, challenge, signature })
    });
  },
  
  // Verify if token is valid
  verifyToken: async (): Promise<{ valid: boolean }> => {
    return fetchWithAuth('/auth/verify');
  }
};

// Student API calls
export const studentAPI = {
  // Create or update student profile
  createProfile: async (profileData: Partial<User>): Promise<{ message: string }> => {
    return fetchWithAuth('/students/profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  },
  
  // Get current user profile
  getProfile: async (): Promise<User> => {
    return fetchWithAuth('/students/profile');
  }
};