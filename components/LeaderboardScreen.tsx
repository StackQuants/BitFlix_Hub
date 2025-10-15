import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import LeaderboardPodium from './LeaderboardPodium';
import LeaderboardList from './LeaderboardList';

interface LeaderboardScreenProps {
    players: Player[];
}

const DailyLeaderboardList: React.FC<{ players: Player[] }> = ({ players }) => {
    return <LeaderboardList players={players} showDailyWins />;
};

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ players }) => {
  const [activeTab, setActiveTab] = useState('Global');
  const tabs = ['Global', 'Monthly', 'Daily'];

  const topPlayers = players.slice(0, 3);
  const remainingPlayers = players.slice(3);

  const dailyPlayers = useMemo(() => {
    return [...players]
      .map(p => ({ ...p, dailyWins: Math.floor(Math.random() * 8) + 1 }))
      .sort((a, b) => b.dailyWins - a.dailyWins);
  }, [players]);

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
            <DailyLeaderboardList players={dailyPlayers} />
        )}
        {activeTab === 'Monthly' && (
            <div className="text-center pt-20 text-gray-500">
                <p>{activeTab} leaderboards coming soon.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardScreen;