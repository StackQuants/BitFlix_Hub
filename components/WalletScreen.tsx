import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface WalletScreenProps {
  user: User;
}

interface StxBalance {
  balance: string;
  total_sent: string;
  total_received: string;
  total_fees_sent: string;
  total_miner_rewards_received: string;
  lock_tx_id: string;
  locked: string;
  lock_height: number;
  burnchain_lock_height: number;
  burnchain_unlock_height: number;
}

const WalletScreen: React.FC<WalletScreenProps> = ({ user }) => {
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [lockedBalance, setLockedBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch actual wallet balance from Hiro API
  const fetchWalletData = async () => {
    if (!user.walletAddress) {
      setIsLoading(false);
      setError('No wallet address connected');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch STX balance from Hiro API
      const balanceResponse = await fetch(
        `https://api.testnet.hiro.so/extended/v1/address/${user.walletAddress}/stx`
      );
      
      if (!balanceResponse.ok) {
        throw new Error(`Failed to fetch STX balance: ${balanceResponse.status} ${balanceResponse.statusText}`);
      }
      
      const balanceData: StxBalance = await balanceResponse.json();
      
      // Convert from microSTX to STX
      const balance = parseInt(balanceData.balance) / 1000000;
      const locked = parseInt(balanceData.locked) / 1000000;
      
      setWalletBalance(balance);
      setLockedBalance(locked);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error fetching STX balance:', error);
      setError('Failed to load wallet data. Please try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user.walletAddress) {
      fetchWalletData();
    }
  }, [user.walletAddress]);

  const handleRefresh = () => {
    fetchWalletData();
  };

  const formatAddress = (address: string) => {
    if (!address) return 'Not connected';
    return `${address.slice(0, 8)}...${address.slice(-6)}`;
  };

  const openInExplorer = () => {
    if (user.walletAddress) {
      window.open(`https://explorer.hiro.so/address/${user.walletAddress}?chain=testnet`, '_blank');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Wallet</h1>
      
      {/* Current Balance */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg text-gray-200">STX Balance</h2>
            <p className="text-4xl font-bold mt-2">
              {isLoading ? 'Loading...' : walletBalance !== null ? `${walletBalance.toFixed(2)} STX` : '--'}
            </p>
            {lockedBalance !== null && lockedBalance > 0 && (
              <p className="text-sm text-gray-300 mt-1">
                Locked: {lockedBalance.toFixed(2)} STX
              </p>
            )}
            <p className="text-sm text-gray-200 mt-1">
              {formatAddress(user.walletAddress || '')}
            </p>
            {error && (
              <p className="text-red-300 text-sm mt-2">{error}</p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        {user.walletAddress && (
          <button
            onClick={openInExplorer}
            className="mt-4 bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-sm transition-colors duration-200"
          >
            View on Stacks Explorer
          </button>
        )}
      </div>

      {/* Available vs Staking Balance */}
      {walletBalance !== null && lockedBalance !== null && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Available</p>
            <p className="text-xl font-bold text-green-400">
              {(walletBalance - lockedBalance).toFixed(2)} STX
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Staking</p>
            <p className="text-xl font-bold text-yellow-400">
              {lockedBalance.toFixed(2)} STX
            </p>
            <p className="text-xs text-gray-500 mt-1">Coming Soon...</p>
          </div>
        </div>
      )}

      {/* FP Balance */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Flix Points (FP)</h2>
        <p className="text-2xl font-bold text-cyan-400">{user.balance.toFixed(2)} FP</p>
        <p className="text-sm text-gray-400 mt-1">
         
        </p>
      </div>

      {/* Network Info */}
      <div className="mt-6 text-center">
        {/* <p className="text-sm text-gray-500">Data loaded from Hiro Stacks Testnet API</p> */}
      </div>
    </div>
  );
};

export default WalletScreen;