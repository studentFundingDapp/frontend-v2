import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { isFreighterInstalled, connectWithFreighter } from "../lib/freighter";

interface WalletContextType {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("wallet_address");
    if (stored) setWalletAddress(stored);
  }, []);

  const connectWallet = async () => {
    if (!isFreighterInstalled()) {
      alert("Please install Freighter extension.");
      return;
    }

    const pubKey = await connectWithFreighter();
    setWalletAddress(pubKey);
    localStorage.setItem("wallet_address", pubKey);
  };

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within a WalletProvider");
  return context;
};
export default WalletContext;