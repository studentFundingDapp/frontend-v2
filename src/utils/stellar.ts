export const networkPassphrase = "Test SDF Network ; September 2015";

// Mock functions for MVP testing
export const getAccountInfo = async (publicKey: string) => {
  console.log('Mock: Getting account info for', publicKey);
  return { id: publicKey, balances: [] };
};

export const getAccountBalance = async (publicKey: string): Promise<string> => {
  console.log('Mock: Getting balance for', publicKey);
  return '100.0000000'; // Mock balance
};

// TODO: Add real Stellar SDK integration later
// Uncomment the following lines to use the Stellar SDK when ready
/*
import { Server, Networks } from "@stellar/stellar-sdk";
export const server = new Server("https://horizon-testnet.stellar.org");
*/