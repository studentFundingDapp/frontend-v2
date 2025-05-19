// src/types/stellar.ts

// Type definitions for Freighter wallet extension
export interface FreighterWindow extends Window {
  freighter?: {
    isConnected: () => Promise<boolean>;
    getPublicKey: () => Promise<string>;
    signTransaction: (transaction: string) => Promise<string>;
    signMessage: (message: string) => Promise<{ signedMessage: string }>;
  }
}

declare global {
  interface Window extends FreighterWindow {}
}

// User types
export interface User {
  publicKey: string;
  name?: string;
  email?: string;
  institution?: string;
  studyField?: string;
  bio?: string;
  profileComplete?: boolean;
}

// Auth response types
export interface AuthResponse {
  token: string;
  user?: User;
}

// Challenge response type
export interface ChallengeResponse {
  challenge: string;
}