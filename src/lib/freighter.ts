// Ensure TypeScript knows about the Freighter global
declare global {
  interface Window {
    freighterApi?: {
      isConnected: () => Promise<boolean>;
      getPublicKey: () => Promise<string>;
      signTransaction: (xdr: string, opts: { network: string }) => Promise<string>;
    };
  }
}

/**
 * Check if Freighter is installed in the browser.
 */
export const isFreighterInstalled = (): boolean => {
  return typeof window.freighterApi !== "undefined";
};

/**
 * Connect to Freighter and return the user's public key.
 */
export const connectWithFreighter = async (): Promise<string> => {
  if (!isFreighterInstalled()) {
    throw new Error("Freighter is not installed");
  }

  const isConnected = await window.freighterApi!.isConnected();
  if (!isConnected) {
    throw new Error("Freighter is not connected");
  }

  const publicKey = await window.freighterApi!.getPublicKey();
  return publicKey;
};

/**
 * Sign an XDR transaction using Freighter.
 */
export const signWithFreighter = async (
  xdr: string,
  network: "TESTNET" | "PUBLIC" = "TESTNET"
): Promise<string> => {
  if (!isFreighterInstalled()) {
    throw new Error("Freighter is not installed");
  }

  const signedXDR = await window.freighterApi!.signTransaction(xdr, { network });
  return signedXDR;
};
