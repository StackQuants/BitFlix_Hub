// ============================================
// COMPLETE types.ts FILE
// ============================================

export enum Tab {
  Home = 'Home',
  Rankings = 'Rankings',
  Profile = 'Profile',
  Wallet = 'Wallet',
  // Streaks removed - now integrated into Profile
}

export interface StreakData {
  currentWinStreak: number;      // Current consecutive wins
  bestWinStreak: number;          // All-time best win streak
  currentPlayStreak: number;      // Current consecutive days played
  bestPlayStreak: number;         // Best consecutive days played
  lastPlayedDate: string;         // Last date user played (for daily tracking)
  streakActive: boolean;          // Whether win streak is currently active
  totalGamesPlayed: number;       // Total number of games played
}

export interface GameResult {
  id: string;
  opponent: Player;
  result: 'win' | 'loss' | 'draw';  // Added 'draw' as a possible result
  amount: number;
  date: string;
}

export interface User {
  name: string;
  avatarUrl: string;
  balance: number;
  gameHistory: GameResult[];
  walletAddress?: string;
  streakData?: StreakData;        // Added for streak tracking
  unlockedGames?: string[];       // NEW - Array of unlocked game IDs (one-time payment tracking)
}

export interface Player {
  rank: number;
  name: string;
  avatarUrl: string;
  balance: number;
  level: number;
  winRate: number;
}

export interface Game {
  id: string;
  title: string;
  name: string;
  description?: string;
  imageUrl: string;
  status: 'LIVE' | 'SOON';
  entryFee: number;
  playerCount?: number;
}