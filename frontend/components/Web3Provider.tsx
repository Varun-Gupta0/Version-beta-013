'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { web3Service } from '@/lib/web3';

interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  balance: string | null;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await web3Service.initialize();
      const userAccount = await web3Service.getAccount();
      const userBalance = await web3Service.getBalance();

      setAccount(userAccount);
      setBalance(userBalance);
      setIsConnected(true);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to connect to Web3:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    web3Service.disconnect();
    setIsConnected(false);
    setAccount(null);
    setBalance(null);
    setError(null);
  };

  // Listen for account changes
  useEffect(() => {
    if (isConnected) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          try {
            const newBalance = await web3Service.getBalance();
            setBalance(newBalance);
          } catch (err) {
            console.error('Failed to get new balance:', err);
          }
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      web3Service.onAccountsChanged(handleAccountsChanged);
      web3Service.onChainChanged(handleChainChanged);

      return () => {
        web3Service.removeAllListeners();
      };
    }
  }, [isConnected, account]);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connect();
          }
        } catch (err) {
          console.error('Failed to check existing connection:', err);
        }
      }
    };

    checkConnection();
  }, []);

  const value: Web3ContextType = {
    isConnected,
    account,
    balance,
    isLoading,
    connect,
    disconnect,
    error,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}
