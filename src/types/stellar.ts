// src/types/stellar.ts

// Freighter wallet API types (matches what the extension exposes on window.freighterApi)
export interface FreighterApi {
  isConnected: () => Promise<boolean>;
  getPublicKey: () => Promise<string>;
  signTransaction: (transaction: string) => Promise<string>;
  signMessage: (message: string) => Promise<{ signedMessage: string }>;
}

// Extend the global Window type to include Freighter
declare global {
  interface Window {
    freighterApi?: FreighterApi;
  }
}

// User type
export interface User {
  publicKey: string;
  name?: string;
  email?: string;
  institution?: string;
  studyField?: string;
  bio?: string;
  profileComplete?: boolean;
}

// Auth response type
export interface AuthResponse {
  token: string;
  user?: User;
}

// Challenge response type
export interface ChallengeResponse {
  challenge: string;
}

// Make sure this file is treated as a module
export {};
