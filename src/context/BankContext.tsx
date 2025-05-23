
import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  type: "checking" | "savings" | "credit" | "investment";
  connected: boolean;
}

interface BankContextType {
  accounts: BankAccount[];
  connectAccount: (accountDetails: Omit<BankAccount, "id" | "connected">) => void;
  disconnectAccount: (id: string) => void;
  isConnecting: boolean;
  startConnecting: () => void;
  cancelConnecting: () => void;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const useBanking = (): BankContextType => {
  const context = useContext(BankContext);
  if (context === undefined) {
    throw new Error("useBanking must be used within a BankProvider");
  }
  return context;
};

interface BankProviderProps {
  children: ReactNode;
}

export const BankProvider = ({ children }: BankProviderProps) => {
  const [accounts, setAccounts] = useState<BankAccount[]>(() => {
    const savedAccounts = localStorage.getItem("bankAccounts");
    return savedAccounts ? JSON.parse(savedAccounts) : [];
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const startConnecting = () => {
    setIsConnecting(true);
  };

  const cancelConnecting = () => {
    setIsConnecting(false);
  };

  const connectAccount = (accountDetails: Omit<BankAccount, "id" | "connected">) => {
    const newAccount = {
      ...accountDetails,
      id: crypto.randomUUID(),
      connected: true
    };
    
    setAccounts(prev => {
      const updated = [...prev, newAccount];
      localStorage.setItem("bankAccounts", JSON.stringify(updated));
      return updated;
    });
    
    setIsConnecting(false);
    
    toast({
      title: "Account connected",
      description: `${accountDetails.name} has been connected successfully.`
    });
  };

  const disconnectAccount = (id: string) => {
    setAccounts(prev => {
      const updated = prev.filter(account => account.id !== id);
      localStorage.setItem("bankAccounts", JSON.stringify(updated));
      return updated;
    });
    
    toast({
      title: "Account disconnected",
      description: "Bank account has been disconnected."
    });
  };

  return (
    <BankContext.Provider
      value={{
        accounts,
        connectAccount,
        disconnectAccount,
        isConnecting,
        startConnecting,
        cancelConnecting
      }}
    >
      {children}
    </BankContext.Provider>
  );
};
