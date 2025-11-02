'use client';

import { useWeb3 } from './Web3Provider';
import { useState } from 'react';

export default function WalletConnect() {
  const { isConnected, account, balance, isLoading, connect, disconnect, error } = useWeb3();
  const [showFullAddress, setShowFullAddress] = useState(false);

  const formatAddress = (address: string) => {
    if (showFullAddress) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-4">
        <div className="bg-green-100 dark:bg-green-900 px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Connected
            </span>
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg">
          <div className="text-sm">
            <div
              className="font-mono cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
              onClick={() => setShowFullAddress(!showFullAddress)}
              title={showFullAddress ? 'Click to shorten' : 'Click to show full address'}
            >
              {formatAddress(account)}
            </div>
            {balance && (
              <div className="text-gray-600 dark:text-gray-400 text-xs">
                {parseFloat(balance).toFixed(4)} ETH
              </div>
            )}
          </div>
        </div>

        <button
          onClick={disconnect}
          className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg max-w-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={connect}
        disabled={isLoading}
        className="flex items-center gap-3 px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Connecting...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Connect Wallet
          </>
        )}
      </button>

      {!window.ethereum && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center max-w-md">
          MetaMask not detected. Please install{' '}
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
          >
            MetaMask
          </a>{' '}
          to connect your wallet.
        </p>
      )}
    </div>
  );
}
