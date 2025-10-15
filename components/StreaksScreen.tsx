import React from 'react';
import { User, GameResult } from '../types';

interface StreaksScreenProps {
  user: User;
}

const StreaksScreen: React.FC<StreaksScreenProps> = ({ user }) => {
  const streakData = user.streakData || {
    currentWinStreak: 0,
    bestWinStreak: 0,
    currentPlayStreak: 0,
    bestPlayStreak: 0,
    lastPlayedDate: '',
    streakActive: false,
    totalGamesPlayed: 0,
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 10) return '🔥💥';
    if (streak >= 5) return '🔥';
    if (streak >= 3) return '⚡';
    if (streak >= 1) return '✨';
    return '💤';
  };

  const getStreakMessage = (winStreak: number) => {
    if (winStreak >= 10) return 'LEGENDARY! You\'re on fire!';
    if (winStreak >= 5) return 'Amazing! Keep it going!';
    if (winStreak >= 3) return 'Great streak! Don\'t stop now!';
    if (winStreak >= 1) return 'Good start! Build your streak!';
    return 'Play a game to start your streak!';
  };

  return (
    <div className="p-6 text-white h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
          Streaks 🔥
        </span>
      </h1>

      {/* Current Win Streak - Hero Section */}
      <div className="relative mb-8">
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl p-8 shadow-2xl shadow-orange-500/30">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-2">Current Win Streak</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-6xl animate-pulse">
                {getStreakEmoji(streakData.currentWinStreak)}
              </span>
              <span className="text-7xl font-black">{streakData.currentWinStreak}</span>
            </div>
            <p className="text-white/90 text-lg font-semibold">
              {getStreakMessage(streakData.currentWinStreak)}
            </p>
          </div>
        </div>
        
        {streakData.streakActive && streakData.currentWinStreak > 0 && (
          <div className="absolute -top-2 -right-2">
            <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce">
              ACTIVE
            </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Best Win Streak */}
        <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-5 shadow-lg">
          <div className="text-center">
            <span className="text-3xl mb-2 block">🏆</span>
            <p className="text-sm text-white/80 mb-1">Best Win Streak</p>
            <p className="text-4xl font-bold">{streakData.bestWinStreak}</p>
          </div>
        </div>

        {/* Daily Play Streak */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 shadow-lg">
          <div className="text-center">
            <span className="text-3xl mb-2 block">📅</span>
            <p className="text-sm text-white/80 mb-1">Days Played</p>
            <p className="text-4xl font-bold">{streakData.currentPlayStreak}</p>
          </div>
        </div>

        {/* Best Daily Streak */}
        <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-5 shadow-lg">
          <div className="text-center">
            <span className="text-3xl mb-2 block">⭐</span>
            <p className="text-sm text-white/80 mb-1">Best Daily</p>
            <p className="text-4xl font-bold">{streakData.bestPlayStreak}</p>
          </div>
        </div>

        {/* Total Games */}
        <div className="bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl p-5 shadow-lg">
          <div className="text-center">
            <span className="text-3xl mb-2 block">🎮</span>
            <p className="text-sm text-white/80 mb-1">Total Games</p>
            <p className="text-4xl font-bold">{streakData.totalGamesPlayed}</p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="bg-[#1a1d29] rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>🎯</span>
          <span>Milestones</span>
        </h3>
        <div className="space-y-3">
          <MilestoneItem 
            title="First Win"
            achieved={streakData.bestWinStreak >= 1}
            description="Win your first game"
          />
          <MilestoneItem 
            title="Hot Streak"
            achieved={streakData.bestWinStreak >= 3}
            description="Win 3 games in a row"
          />
          <MilestoneItem 
            title="On Fire"
            achieved={streakData.bestWinStreak >= 5}
            description="Win 5 games in a row"
          />
          <MilestoneItem 
            title="Unstoppable"
            achieved={streakData.bestWinStreak >= 10}
            description="Win 10 games in a row"
          />
          <MilestoneItem 
            title="Daily Grinder"
            achieved={streakData.bestPlayStreak >= 7}
            description="Play for 7 days straight"
          />
        </div>
      </div>

      {/* Recent Performance */}
      <div className="bg-[#1a1d29] rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4">Recent Performance</h3>
        <div className="flex gap-1 flex-wrap">
          {user.gameHistory.slice(0, 10).map((game, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold ${
                game.result === 'win' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}
            >
              {game.result === 'win' ? 'W' : 'L'}
            </div>
          ))}
        </div>
        {user.gameHistory.length === 0 && (
          <p className="text-gray-500 text-center py-4">No games played yet</p>
        )}
      </div>
    </div>
  );
};

const MilestoneItem: React.FC<{
  title: string;
  achieved: boolean;
  description: string;
}> = ({ title, achieved, description }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg ${
    achieved ? 'bg-green-500/20' : 'bg-gray-800/30'
  }`}>
    <div className={`text-2xl ${achieved ? 'grayscale-0' : 'grayscale opacity-30'}`}>
      {achieved ? '✅' : '⭕'}
    </div>
    <div className="flex-1">
      <p className={`font-semibold ${achieved ? 'text-green-400' : 'text-gray-400'}`}>
        {title}
      </p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

export default StreaksScreen;