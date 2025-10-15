import React from 'react';
import { Player } from '../types';

interface LeaderboardPodiumProps {
  players: Player[];
}

const PodiumItem: React.FC<{ player: Player; position: number }> = ({ player, position }) => {
  const styles = {
    1: {
      height: 'h-28',
      bgColor: 'bg-yellow-500/80 border-yellow-400',
      textColor: 'text-yellow-300',
      avatarSize: 'w-20 h-20',
      rankBadge: 'bg-yellow-500',
      order: 'order-2',
      align: 'self-end',
      nameSize: 'text-base',
      width: 'w-40', // Increased width for 1st place
      barWidth: 'w-36', // Wider bar for 1st place
    },
    2: {
      height: 'h-24',
      bgColor: 'bg-slate-400/80 border-slate-300',
      textColor: 'text-slate-300',
      avatarSize: 'w-16 h-16',
      rankBadge: 'bg-slate-400',
      order: 'order-1',
      align: 'self-end',
      nameSize: 'text-sm',
      width: 'w-36', // Increased width for 2nd place
      barWidth: 'w-32', // Wider bar for 2nd place
    },
    3: {
      height: 'h-20',
      bgColor: 'bg-orange-600/80 border-orange-500',
      textColor: 'text-orange-400',
      avatarSize: 'w-16 h-16',
      rankBadge: 'bg-orange-600',
      order: 'order-3',
      align: 'self-end',
      nameSize: 'text-sm',
      width: 'w-36', // Increased width for 3rd place
      barWidth: 'w-32', // Wider bar for 3rd place
    },
  };

  const style = styles[position as keyof typeof styles];

  return (
    <div className={`flex flex-col items-center ${style.width} ${style.order} ${style.align} -mb-1`}>
      <div className="relative">
        <img
          src={player.avatarUrl}
          alt={player.name}
          className={`${style.avatarSize} rounded-full border-4 ${style.bgColor.split(' ')[1]}`}
        />
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 ${style.rankBadge} rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-800`}>
          {player.rank}
        </div>
      </div>
      <p className="font-bold mt-3" style={{ fontSize: '12px' }}>{player.name}</p>
      <p className={`text-xs ${style.textColor} mb-3`}>{player.balance.toFixed(3)} STX</p>
      <div className={`flex justify-center w-full`}>
        <div className={`${style.height} ${style.barWidth} ${style.bgColor} border-t-2 rounded-t-lg`}></div>
      </div>
    </div>
  );
};

const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({ players }) => {
  const rankedPlayers = [...players].sort((a, b) => a.rank - b.rank);
  const player1 = rankedPlayers.find(p => p.rank === 1);
  const player2 = rankedPlayers.find(p => p.rank === 2);
  const player3 = rankedPlayers.find(p => p.rank === 3);

  return (
    <div className="flex items-end justify-between w-full max-w-4xl mx-auto h-48 px-8 space-x-4">
      {player2 && <PodiumItem player={player2} position={2} />}
      {player1 && <PodiumItem player={player1} position={1} />}
      {player3 && <PodiumItem player={player3} position={3} />}
    </div>
  );
};

export default LeaderboardPodium;