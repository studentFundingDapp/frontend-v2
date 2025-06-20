// Simple Freighter wallet utilities for MVP

declare global {
  interface Window {
    freighter?: {
      requestAccess: () => Promise<string>;
      getNetwork: () => Promise<string>;
      signTransaction?: (xdr: string, network: string) => Promise<string>;
    };
  }
}

export const checkFreighterAvailability = async (): Promise<boolean> => {
  return !!window.freighter;
};

export const connectFreighterWallet = async () => {
  if (!window.freighter) {
    throw new Error('Freighter wallet not found');
  }

  try {
    const publicKey = await window.freighter.requestAccess();
    const network = await window.freighter.getNetwork();
    
    return { publicKey, network };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect wallet');
  }
};