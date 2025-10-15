import { Player, Game } from './types';

export const players: Player[] = [
  { rank: 1, name: 'CryptoQueen', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', balance: 732, level: 87, winRate: 85.8 },
  { rank: 2, name: 'BitcoinKing', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', balance: 608, level: 76, winRate: 76.1 },
  { rank: 3, name: 'StacksMaster', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', balance: 518, level: 68, winRate: 72.4 },
  { rank: 4, name: 'EtherAce', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704a', balance: 464, level: 65, winRate: 70.2 },
  { rank: 5, name: 'DogePioneer', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704b', balance: 300, level: 61, winRate: 68.5 },
  { rank: 6, name: 'ChainWizard', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704c', balance: 208, level: 58, winRate: 65.0 },
];

export const games: Game[] = [
    {
        id: '1', // Changed from number to string
        title: 'Chess Championship',
        name: 'Chess Championship',
        description: 'AI-powered chess matches with skill-based matchmaking. Compete against players worldwide.',
        imageUrl: '/chess.png',
        status: 'LIVE',
        entryFee: 50,
        playerCount: 2847,
    },
    {
        id: '2', // Changed from number to string
        title: 'Poker Tournament',
        name: 'Poker Tournament',
        imageUrl: '/poker.png',
        status: 'SOON',
        entryFee: 50,
    },
    {
        id: '3', // Changed from number to string
        title: 'Trivia Challenge',
        name: 'Trivia Challenge',
        imageUrl: '/trivia.png',
        status: 'SOON',
        entryFee: 50,
    },
    {
        id: '4', // Changed from number to string
        title: 'Racing League',
        name: 'Racing League',
        imageUrl: '/race.png',
        status: 'SOON',
        entryFee: 50,
    },
];