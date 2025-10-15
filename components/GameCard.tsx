// ============================================
// 2. UPDATED GameCard.tsx
// ============================================

import React, { useState } from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
  isUnlocked?: boolean; // NEW
  onUnlock?: (gameId: string) => Promise<void>; // NEW
}

const FPIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.18L19.82 8 12 11.82 4.18 8 12 4.18zM4 9.68l7 3.5v7.64l-7-3.5V9.68zm16 0v7.64l-7 3.5v-7.64l7-3.5z"/>
    </svg>
);

const UsersIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.134-1.28-.372-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.134-1.28.372-1.857m6.256-10A3.5 3.5 0 1117.5 5a3.5 3.5 0 01-3.872 3.287M3.5 8.5A3.5 3.5 0 117 5a3.5 3.5 0 01-3.5 3.5zm7.872-3.287A3.5 3.5 0 1010.5 2a3.5 3.5 0 00.872 6.787z" />
    </svg>
);

const LockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

const UnlockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
    </svg>
);

const GameCard: React.FC<GameCardProps> = ({ game, onPlay, isUnlocked = false, onUnlock }) => {
  const isLive = game.status === 'LIVE';
  const [isProcessing, setIsProcessing] = useState(false);
  const POOL_WALLET_ADDRESS = 'STH4YD4TJ4706Y5A37GNJ2P08T68QXAHEYEQQSW';
  const ENTRY_FEE_STX = 50;

  const handlePlayNow = async () => {
    if (isProcessing) return;

    // If game is already unlocked, just play
    if (isUnlocked) {
      console.log('✅ Game already unlocked, starting game...');
      onPlay(game);
      return;
    }

    // Otherwise, initiate one-time payment to unlock
    setIsProcessing(true);
    console.log('🔒 Game locked, initiating unlock payment...');

    try {
      // Check if Leather wallet is available
      if (typeof window === 'undefined' || !(window as any).LeatherProvider) {
        alert('Leather wallet not found. Please install Leather wallet extension first.');
        window.open('https://leather.io/install-extension', '_blank');
        setIsProcessing(false);
        return;
      }

      const leather = (window as any).LeatherProvider;

      // Get connected wallet address
      const addressResponse = await leather.request('getAddresses');
      
      if (!addressResponse.result || !addressResponse.result.addresses) {
        alert('Please connect your Leather wallet first.');
        setIsProcessing(false);
        return;
      }

      // Convert STX to microSTX
      const amountInMicroSTX = ENTRY_FEE_STX * 1000000;

      // Initiate STX transfer
      const txOptions = {
        recipient: POOL_WALLET_ADDRESS,
        amount: amountInMicroSTX.toString(),
        memo: `BitFlix Unlock: ${game.title}`
      };

      console.log('💰 Initiating payment:', txOptions);

      const txResponse = await leather.request('stx_transferStx', txOptions);

      if (txResponse.result && txResponse.result.txid) {
        console.log('✅ Payment successful! TX ID:', txResponse.result.txid);
        
        alert(
          `✅ Payment Successful!\n\n` +
          `Transaction ID: ${txResponse.result.txid}\n\n` +
          `${game.title} is now unlocked FOREVER!\n` +
          `You can play anytime without paying again.\n\n` +
          `Starting game...`
        );

        // Unlock the game permanently - WAIT for this to complete
        if (onUnlock) {
          console.log('🔓 Unlocking game...');
          await onUnlock(game.id);
          console.log('✅ Game unlock completed');
        }
        
        // Give a moment for state to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Start the game
        console.log('🎮 Starting game...');
        onPlay(game);
        setIsProcessing(false);
      } else {
        throw new Error('Transaction failed - no transaction ID received');
      }
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error.message && error.message.includes('Insufficient')) {
        errorMessage = `Insufficient balance. You need at least ${ENTRY_FEE_STX} STX to unlock this game.`;
      } else if (error.message && error.message.includes('User rejected')) {
        errorMessage = 'Payment cancelled by user.';
      }
      
      alert(`❌ ${errorMessage}\n\nError: ${error.message || 'Unknown error'}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden relative shadow-lg h-48 flex flex-col justify-end text-white">
      <img src={game.imageUrl} alt={game.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
      
      {/* Status Badges */}
      <div className="absolute top-3 right-3 flex gap-2">
        {isUnlocked && isLive && (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-600 flex items-center gap-1">
            <UnlockIcon />
            UNLOCKED
          </span>
        )}
        <span className={`px-3 py-1 text-xs font-bold rounded-full ${isLive ? 'bg-red-600' : 'bg-amber-500'}`}>
          {game.status}
        </span>
      </div>

      <div className="relative p-4 z-10">
        <h3 className="text-xl font-bold">{game.title}</h3>
        {game.description && <p className="text-sm text-gray-300 mt-1">{game.description}</p>}
        
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4 text-xs text-gray-200">
                <div className="flex items-center space-x-1.5 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                    <FPIcon />
                    <span>{isUnlocked && isLive ? 'PAID' : `${ENTRY_FEE_STX} STX`}</span>
                </div>
                {game.playerCount && (
                    <div className="flex items-center space-x-1.5 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                       <UsersIcon />
                        <span>{game.playerCount} players</span>
                    </div>
                )}
            </div>
          {isLive && (
            <button 
              onClick={handlePlayNow}
              disabled={isProcessing}
              className={`font-bold py-2 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ${
                isUnlocked 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isProcessing ? (
                'PROCESSING...'
              ) : isUnlocked ? (
                'PLAY NOW'
              ) : (
                <>
                  <LockIcon />
                  <span>UNLOCK</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
