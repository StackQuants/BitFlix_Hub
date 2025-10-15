// ============================================
// 3. UPDATED HomeScreen.tsx
// ============================================

import React, { useState } from 'react'; // ADDED useState import
import GameCard from './GameCard';
import BitflixChatbot from './BitflixChatbot'; // ADDED chatbot import
import { games } from '../constants';
import { Game } from '../types';

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

interface HomeScreenProps {
  onPlayGame: (game: Game) => void;
  unlockedGames?: string[]; // NEW
  onUnlockGame?: (gameId: string) => Promise<void>; // NEW
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onPlayGame, unlockedGames = [], onUnlockGame }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false); // ADDED chatbot state
  const liveGame = games.find(g => g.status === 'LIVE');
  const comingSoonGames = games.filter(g => g.status === 'SOON');

  const isGameUnlocked = (gameId: string) => {
    return unlockedGames.includes(gameId);
  };

  return (
    <div className="p-4 space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wider text-red-500 uppercase">BITFLIX</h1>
        <div className="flex items-center space-x-3"> {/* ADDED flex container */}
          {/* ADDED AI Chatbot Button */}
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-2 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            title="AI Assistant"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <SearchIcon />
        </div>
      </header>

      <main>
        {liveGame && (
          <GameCard 
            game={liveGame} 
            onPlay={onPlayGame}
            isUnlocked={isGameUnlocked(liveGame.id)}
            onUnlock={onUnlockGame}
          />
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">Coming Soon</h2>
          <div className="space-y-4">
            {comingSoonGames.map(game => (
              <GameCard key={game.id} game={game} onPlay={onPlayGame} />
            ))}
          </div>
        </div>
      </main>
      
      {/* ADDED Chatbot Component */}
      <BitflixChatbot 
        isOpen={isChatbotOpen} 
        onClose={() => setIsChatbotOpen(false)} 
      />
    </div>
  );
};

export default HomeScreen;