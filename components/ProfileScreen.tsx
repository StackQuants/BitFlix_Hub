import React from 'react';
import { User, GameResult } from '../types';

interface ProfileScreenProps {
  user: User;
  onSignOut: () => void;
}

const GameHistoryItem: React.FC<{ result: GameResult }> = ({ result }) => {
  const isWin = result.result === 'win';
  const isDraw = result.result === 'draw';
  
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
      <div className="flex items-center">
        <img src={result.opponent.avatarUrl} alt={result.opponent.name} className="w-10 h-10 rounded-full mr-3" />
        <div>
          <p className="font-semibold text-sm">vs {result.opponent.name}</p>
          <p className="text-xs text-gray-400">{result.date}</p>
        </div>
      </div>
      <div className={`text-right ${
        isWin ? 'text-green-400' : 
        isDraw ? 'text-yellow-400' : 
        'text-red-400'
      }`}>
        <p className="font-bold text-sm">
          {isWin ? 'WIN' : isDraw ? 'DRAW' : 'LOSS'}
        </p>
        <p className="text-xs">
          {isWin ? `+${result.amount.toFixed(2)} FP` : '0 FP'}
        </p>
      </div>
    </div>
  );
};

const MilestoneItem: React.FC<{
  title: string;
  achieved: boolean;
  description: string;
}> = ({ title, achieved, description }) => (
  <div className={`flex items-center gap-3 p-2 rounded-lg ${
    achieved ? 'bg-green-500/20' : 'bg-gray-800/30'
  }`}>
    <div className={`text-xl ${achieved ? 'grayscale-0' : 'grayscale opacity-30'}`}>
      {achieved ? '✅' : '⭕'}
    </div>
    <div className="flex-1">
      <p className={`font-semibold text-sm ${achieved ? 'text-green-400' : 'text-gray-400'}`}>
        {title}
      </p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onSignOut }) => {
  const gamesPlayed = user.gameHistory.length;
  const wins = user.gameHistory.filter(g => g.result === 'win').length;
  const winRate = gamesPlayed > 0 ? ((wins / gamesPlayed) * 100).toFixed(1) : 0;
  
  // Only count winnings from wins (10 FP per win)
  const totalWinnings = user.gameHistory.reduce((acc, game) => {
    return acc + (game.result === 'win' ? game.amount : 0);
  }, 0);

  const streakData = user.streakData || {
    currentWinStreak: 0,
    bestWinStreak: 0,
    currentPlayStreak: 0,
    bestPlayStreak: 0,
    lastPlayedDate: '',
    streakActive: false,
    totalGamesPlayed: 0,
  };

  // DEBUG LOGS
  console.log('=== PROFILE DEBUG ===');
  console.log('User Name:', user.name);
  console.log('Streak Data:', streakData);
  console.log('Games Played:', gamesPlayed);
  console.log('Game History:', user.gameHistory);
  console.log('=====================');

  const getStreakEmoji = (streak: number) => {
    if (streak >= 10) return '🔥💥';
    if (streak >= 5) return '🔥';
    if (streak >= 3) return '⚡';
    if (streak >= 1) return '✨';
    return '💤';
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out? You will need to connect your wallet again to log back in.')) {
      onSignOut();
    }
  };

  return (
    <div className="p-4 text-white h-full overflow-y-auto flex flex-col">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
        <div className="flex flex-col items-center">
          {/* User Avatar and Name Section */}
          <img src={user.avatarUrl} alt={user.name} className="w-28 h-28 rounded-full border-4 border-cyan-400 shadow-lg shadow-cyan-500/20" />
          <h2 className="text-2xl font-bold mt-4 text-cyan-400">{user.name}</h2>
          <p className="text-gray-400">Level 1 Challenger</p>

          {user.walletAddress && (
            <div className="mt-3 bg-black/30 rounded-full px-4 py-2">
              <p className="text-xs text-gray-400">Wallet Address</p>
              <p className="text-sm font-mono">{user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}</p>
            </div>
          )}

          {/* STREAKS SECTION */}
          <div className="mt-6 w-full">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🔥</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                 Streaks
              </span>
            </h3>

            <div className="relative mb-4">
              <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-2xl p-6 shadow-lg shadow-orange-500/30">
                <div className="text-center">
                  <p className="text-white/80 text-xs mb-1">Current Win Streak</p>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-4xl animate-pulse">
                      {getStreakEmoji(streakData.currentWinStreak)}
                    </span>
                    <span className="text-5xl font-black">{streakData.currentWinStreak}</span>
                  </div>
                  <p className="text-white/90 text-sm font-semibold">
                    {streakData.currentWinStreak >= 3 
                      ? `${user.name} is on fire! Keep it going!` 
                      : streakData.currentWinStreak >= 1 
                      ? `Good start ${user.name}! Build your streak!` 
                      : `${user.name}, play to start your streak!`}
                  </p>
                </div>
              </div>
              
              {streakData.streakActive && streakData.currentWinStreak > 0 && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                    ACTIVE
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl p-4 shadow-md">
                <div className="text-center">
                  <span className="text-2xl mb-1 block">🏆</span>
                  <p className="text-xs text-white/80 mb-1">Best Win Streak</p>
                  <p className="text-3xl font-bold">{streakData.bestWinStreak}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 shadow-md">
                <div className="text-center">
                  <span className="text-2xl mb-1 block">📅</span>
                  <p className="text-xs text-white/80 mb-1">Days Played</p>
                  <p className="text-3xl font-bold">{streakData.currentPlayStreak}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1d29] rounded-xl p-4 mb-4">
              <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                <span>🎯</span>
                <span> Milestones</span>
              </h4>
              <div className="space-y-2">
                <MilestoneItem 
                  title="First Win"
                  achieved={streakData.bestWinStreak >= 1}
                  description={`${user.name}'s first victory`}
                />
                <MilestoneItem 
                  title="Hot Streak"
                  achieved={streakData.bestWinStreak >= 3}
                  description="3 wins in a row"
                />
                <MilestoneItem 
                  title="On Fire"
                  achieved={streakData.bestWinStreak >= 5}
                  description="5 wins in a row"
                />
                <MilestoneItem 
                  title="Unstoppable"
                  achieved={streakData.bestWinStreak >= 10}
                  description="10 wins in a row"
                />
              </div>
            </div>

            <div className="bg-[#1a1d29] rounded-xl p-4 mb-4">
              <h4 className="text-sm font-bold mb-3">  Recent Performance</h4>
              <div className="flex gap-1 flex-wrap">
                {user.gameHistory.slice(0, 10).map((game, index) => (
                  <div
                    key={index}
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                      game.result === 'win' 
                        ? 'bg-green-500 text-white' 
                        : game.result === 'draw'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    {game.result === 'win' ? 'W' : game.result === 'draw' ? 'D' : 'L'}
                  </div>
                ))}
              </div>
              {user.gameHistory.length === 0 && (
                <p className="text-gray-500 text-center py-2 text-sm">No games played  yet</p>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-2 w-full bg-[#1a1d29] rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Games Played</span>
              <span className="font-semibold">{gamesPlayed}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Win Rate</span>
              <span className="font-semibold">{winRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Total Winnings</span>
              <span className="font-semibold text-green-400">
                +{totalWinnings.toFixed(2)} FP
              </span>
            </div>
          </div>

          {/* Game History Section */}
          <div className="mt-6 w-full">
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">  Game History</h3>
            <div className="space-y-2">
              {user.gameHistory.length > 0 ? (
                user.gameHistory.slice(0, 5).map(result => <GameHistoryItem key={result.id} result={result} />)
              ) : (
                <p className="text-center text-gray-500 py-4">  No games yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-auto pt-6 pb-4">
        <button
          onClick={handleSignOut}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-lg hover:shadow-red-500/30"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;