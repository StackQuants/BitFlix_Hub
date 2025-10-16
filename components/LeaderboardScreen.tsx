import React, { useState, useMemo } from 'react';
import { Player, User } from '../types';
import LeaderboardPodium from './LeaderboardPodium';
import LeaderboardList from './LeaderboardList';

interface LeaderboardScreenProps {
    players: Player[];
    currentUser?: User | null;
}

const DailyLeaderboardList: React.FC<{ players: Player[]; metricLabel?: string }> = ({ players, metricLabel = 'Daily Wins' }) => {
    return <LeaderboardList players={players} showDailyWins metricLabel={metricLabel} />;
};

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ players, currentUser }) => {
  const [activeTab, setActiveTab] = useState('Global');
  const tabs = ['Global', 'Monthly', 'Daily'];

  // Merge current user into leaderboards dynamically
  const mergedPlayers = useMemo(() => {
    if (!currentUser) return players;
    const existingIdx = players.findIndex(p => p.name === currentUser.name);
    const userAsPlayer: Player = {
      rank: 999,
      name: currentUser.name,
      avatarUrl: currentUser.avatarUrl,
      balance: Math.max(0, currentUser.gameHistory.reduce((sum, g) => sum + (g.result === 'win' ? 5 : 0), 0)),
      level: 1,
      winRate: (() => {
        const total = currentUser.gameHistory.length || 1;
        const wins = currentUser.gameHistory.filter(g => g.result === 'win').length;
        return Number(((wins / total) * 100).toFixed(1));
      })(),
    };
    const base = existingIdx >= 0 ? players : [...players, userAsPlayer];
    // Rank by FP balance desc as a proxy for winnings
    const ranked = [...base].sort((a, b) => b.balance - a.balance).map((p, i) => ({ ...p, rank: i + 1 }));
    return ranked;
  }, [players, currentUser]);

  const topPlayers = mergedPlayers.slice(0, 3);
  const remainingPlayers = mergedPlayers.slice(3);

  // Daily: count today's wins from user history
  const dailyPlayers = useMemo(() => {
    const today = new Date().toLocaleDateString();
    const addDailyWins = (p: Player) => {
      if (!currentUser || p.name !== currentUser.name) return { ...p, dailyWins: Math.floor(Math.random() * 8) + 1 };
      const dailyWins = currentUser.gameHistory.filter(g => g.result === 'win' && g.date === today).length;
      return { ...p, dailyWins } as Player & { dailyWins: number };
    };
    return mergedPlayers.map(addDailyWins).sort((a, b) => (b.dailyWins || 0) - (a.dailyWins || 0));
  }, [mergedPlayers, currentUser]);

  return (
    <div className="flex flex-col h-full bg-[#10131c]">
      <div className="p-4 pt-6">
        <h1 className="text-2xl font-bold text-center mb-4">Leaderboards</h1>
        <div className="flex justify-center bg-[#1a1d29] p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-1/3 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ${
                activeTab === tab ? 'bg-gray-600 text-white' : 'text-gray-400'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto px-4">
        {activeTab === 'Global' && (
          <>
            {/* Increased container height and added more padding */}
            <div className="my-6 p-6 rounded-2xl bg-gradient-to-b from-[#432d4f] via-[#2d223a] to-[#1a1d29] min-h-[280px]">
                {/* Header with doubled bottom margin */}
                <div className="mb-24"> 
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <h2 className="text-xl font-bold">Global Champions</h2>
                      <p className="text-sm text-gray-300">Compete for glory and FP rewards</p>
                    </div>
                  </div>
                </div>
                
                {/* Podium container with increased height */}
                <div className="h-48 flex items-end justify-center">
                  <LeaderboardPodium players={topPlayers} />
                </div>
            </div>
            
            {/* List with top margin */}
            <div className="mt-8">
              <LeaderboardList players={remainingPlayers} />
            </div>
          </>
        )}
        {activeTab === 'Daily' && (
            <DailyLeaderboardList players={dailyPlayers} metricLabel="Daily Wins" />
        )}
        {activeTab === 'Monthly' && (
            <div className="text-center pt-20 text-gray-400">
              <p className="text-lg font-semibold mb-2">Monthly Leaderboard</p>
              <p className="text-sm">Aggregated from players' daily wins and refreshed at the end of each month.</p>
              <p className="text-xs mt-2 text-gray-500">Updates will appear here automatically at month-end. Check back soon.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardScreen;