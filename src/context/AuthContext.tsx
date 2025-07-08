import  { createContext, useContext, useState } from "react";
import type{ReactNode} from "react";
interface User {
  publicKey: string;
  network: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (publicKey: string, network: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (publicKey: string, network: string, role: string) => {
    setUser({ publicKey, network, role });
    localStorage.setItem("wallet_address", publicKey);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("wallet_address");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
