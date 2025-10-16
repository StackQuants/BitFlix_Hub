
import React from 'react';
import { Player } from '../types';

interface LeaderboardListProps {
  players: (Player & { dailyWins?: number })[];
  showDailyWins?: boolean;
}

const BTCIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.632 11.232c.312-.601.442-1.272.288-1.932-.144-.66-.498-1.23-.924-1.632l-1.056-1.056-2.028 2.028c.156.096.288.228.396.396.108.168.18.372.18.576s-.072.408-.18.576c-.108.168-.24.3-.396.396l2.028 2.028 1.056-1.056c.426-.396.78-.972.924-1.632.154-.66.024-1.331-.288-1.932zm-6.264 4.032c-.156-.096-.288-.228-.396-.396-.108-.168-.18-.372-.18-.576s.072-.408.18-.576.24-.3.396-.396l-2.028-2.028-1.056 1.056c-.426.396-.78.972-.924 1.632-.154.66-.024 1.331.288 1.932.312.601.442 1.272.288 1.932.144.66.498 1.23.924 1.632l1.056 1.056 2.028-2.028c-.156-.096-.288-.228-.396-.396-.108-.168-.18-.372-.18-.576s.072-.408.18-.576c.108-.168.24-.3.396-.396l-2.028-2.028zm2.856-8.232l-1.056 1.056-1.056-1.056-1.056 1.056-2.316-2.316 1.056-1.056 1.056 1.056 1.26-1.26-1.26-1.26 2.028-2.028 1.26 1.26 1.26-1.26 1.056 1.056-2.316 2.316zm5.256 5.256l-1.056 1.056 1.056 1.056-1.056 1.056 2.316 2.316 1.056-1.056-1.056-1.056 1.26-1.26 1.26 1.26 2.028-2.028-1.26-1.26-1.26 1.26-1.056-1.056z"/>
    </svg>
);

const TrophyIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M11.25 2.25a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V3.31l-4.72 4.72a.75.75 0 01-1.06 0l-.354-.353a.75.75 0 010-1.06l4.72-4.72H3a.75.75 0 010-1.5h7.5a.75.75 0 01.75.75z" clipRule="evenodd" />
        <path d="M1.5 9.75a.75.75 0 01.75-.75h15a.75.75 0 010 1.5h-15a.75.75 0 01-.75-.75z" />
        <path d="M3 13.5a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" />
        <path fillRule="evenodd" d="M4 17.25a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);


const LeaderboardList: React.FC<LeaderboardListProps> = ({ players, showDailyWins = false }) => {
  return (
    <div className="space-y-3 pb-4">
      {players.map((player, index) => (
        <div key={player.rank} className="flex items-center bg-[#1a1d29] p-3 rounded-lg">
          <div className="flex items-center w-2/3">
            <span className="text-gray-400 font-semibold w-8 text-center">{showDailyWins ? index + 1 : player.rank}</span>
            <img src={player.avatarUrl} alt={player.name} className="w-10 h-10 rounded-full ml-2 mr-4" />
            <div>
              <p className="font-semibold">{player.name}</p>
              <p className="text-xs text-gray-400">Level {player.level} <span className="mx-1">•</span> Win Rate: {player.winRate}%</p>
            </div>
          </div>
          <div className="flex items-center justify-end w-1/3 space-x-2 text-right">
            {showDailyWins ? (
                <div className="flex items-center text-sm text-yellow-300 bg-yellow-500/10 p-1.5 rounded-md">
                    <TrophyIcon/>
                    <span className="ml-1.5 text-xs font-bold">{player.dailyWins} Wins</span>
                </div>
            ) : (
                <div className="flex flex-col items-end">
                    <span className="font-bold text-orange-400 flex items-center"><BTCIcon /> <span className="ml-1">{player.balance.toFixed(0)}</span></span>
                    <span className="text-xs text-gray-500">FP</span>
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaderboardList;
