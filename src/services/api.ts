// src/services/api.ts

import type { AuthResponse, User, ChallengeResponse } from '../types/stellar';

const API_URL = 'http://studybae.online:8000'; 

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

export const authAPI = {
  getChallenge: async (publicKey: string): Promise<ChallengeResponse> => {
    return fetchWithAuth('/auth/challenge', {
      method: 'POST',
      body: JSON.stringify({ publicKey })
    });
  },
  
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

  verifyToken: async (): Promise<{ valid: boolean }> => {
    return fetchWithAuth('/auth/verify');
  }
};

export const studentAPI = {
  createProfile: async (profileData: Partial<User>): Promise<{ message: string }> => {
    return fetchWithAuth('/students/profile', {
      method: 'POST',
      body: JSON.stringify(profileData)
    });
  },

  getProfile: async (): Promise<User> => {
    return fetchWithAuth('/students/profile');
  }
};
