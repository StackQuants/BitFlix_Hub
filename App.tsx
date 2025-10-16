import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import HomeScreen from './components/HomeScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import ProfileScreen from './components/ProfileScreen';
import WalletScreen from './components/WalletScreen';
import EntryScreen from './components/EntryScreen';
import ChessGameScreen from './components/ChessGameScreen';
import { Tab, Game, User, Player, GameResult, StreakData } from './types';
import { players as initialPlayers } from './constants';
import { useStacks } from './components/hooks/useStacks';

// Helper function to check if dates are consecutive
const isConsecutiveDay = (lastDate: string, currentDate: string): boolean => {
  const last = new Date(lastDate);
  const current = new Date(currentDate);
  const diffTime = Math.abs(current.getTime() - last.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

// Helper function to update streak data
const updateStreakData = (
  currentStreakData: StreakData,
  gameResult: 'win' | 'loss'
): StreakData => {
  const today = new Date().toDateString();
  const isNewDay = currentStreakData.lastPlayedDate !== today;

  let newStreakData = { ...currentStreakData };

  // Update play streak if new day
  if (isNewDay) {
    if (isConsecutiveDay(currentStreakData.lastPlayedDate, today)) {
      newStreakData.currentPlayStreak += 1;
    } else if (currentStreakData.lastPlayedDate) {
      newStreakData.currentPlayStreak = 1;
    } else {
      newStreakData.currentPlayStreak = 1;
    }
    newStreakData.lastPlayedDate = today;
    newStreakData.bestPlayStreak = Math.max(
      newStreakData.bestPlayStreak,
      newStreakData.currentPlayStreak
    );
  }

  // Update win streak
  if (gameResult === 'win') {
    newStreakData.currentWinStreak += 1;
    newStreakData.streakActive = true;
    newStreakData.bestWinStreak = Math.max(
      newStreakData.bestWinStreak,
      newStreakData.currentWinStreak
    );
  } else {
    newStreakData.currentWinStreak = 0;
    newStreakData.streakActive = false;
  }

  newStreakData.totalGamesPlayed += 1;

  return newStreakData;
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Home);
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  
  const { disconnectWallet, isConnected, address } = useStacks();

  const getProfileKey = (walletAddress: string) => `bitflix_profile_${walletAddress}`;

  const loadProfile = (walletAddress: string): User | null => {
    try {
      const raw = localStorage.getItem(getProfileKey(walletAddress));
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed as User;
    } catch {
      return null;
    }
  };

  const saveProfile = (user: User) => {
    if (!user.walletAddress) return;
    try {
      localStorage.setItem(getProfileKey(user.walletAddress), JSON.stringify(user));
    } catch {}
  };

  const handleLogin = (address: string, name: string) => {
    if (!(address && name)) {
      alert('Please connect your wallet and enter your name.');
      return;
    }

    const existing = loadProfile(address);
    if (existing) {
      const updated = { ...existing, name, walletAddress: address } as User;
      setCurrentUser(updated);
      saveProfile(updated);
      console.log('🔑 Loaded existing profile for:', address);
      return;
    }

    const storageKey = `bitflix_unlocked_${address}`;
    const savedUnlockedGames = localStorage.getItem(storageKey);
    const unlockedGames = savedUnlockedGames ? JSON.parse(savedUnlockedGames) : [];

    const newUser: User = {
      name,
      avatarUrl: `https://i.pravatar.cc/150?u=${address}`,
      balance: 40,
      gameHistory: [],
      walletAddress: address,
      unlockedGames,
      streakData: {
        currentWinStreak: 0,
        bestWinStreak: 0,
        currentPlayStreak: 0,
        bestPlayStreak: 0,
        lastPlayedDate: '',
        streakActive: false,
        totalGamesPlayed: 0,
      },
    };

    setCurrentUser(newUser);
    saveProfile(newUser);
    console.log('✅ Wallet connected:', address);
    console.log('👤 User name set to:', name);
    console.log('📂 Loaded unlocked games:', unlockedGames);
    console.log('💾 Profile saved:', getProfileKey(address));
  };

  React.useEffect(() => {
    if (isConnected && address && !currentUser) {
      console.log('🔄 Auto-login triggered from wallet connection');
      const existing = loadProfile(address);
      if (existing) {
        setCurrentUser(existing);
        console.log('🔑 Loaded profile on auto-login');
      } else {
        const userData = localStorage.getItem('bitflix_user');
        const userName = userData ? JSON.parse(userData).name : `Player${address.slice(-4)}`;
        handleLogin(address, userName);
      }
    }
  }, [isConnected, address, currentUser]);

  const handleSignOut = () => {
    console.log('🚪 Signing out and disconnecting wallet');
    disconnectWallet();
    setCurrentUser(null);
    setActiveTab(Tab.Home);
    setActiveGame(null);
    console.log('✅ Signed out');
  };

  // Handle game unlock (one-time payment)
  const handleUnlockGame = async (gameId: string) => {
    if (!currentUser || !currentUser.walletAddress) {
      console.error('❌ Cannot unlock: No user or wallet address');
      return;
    }
    
    console.log('🔓 Starting unlock process for game:', gameId);
    
    // Add game to unlocked list
    const newUnlockedGames = [...(currentUser.unlockedGames || []), gameId];
    
    const updatedUser: User = {
      ...currentUser,
      unlockedGames: newUnlockedGames,
    };
    
    // Update state immediately
    setCurrentUser(updatedUser);
    saveProfile(updatedUser);
    console.log('📝 State updated with unlocked game');
    
    // Save to localStorage for persistence (tied to wallet address)
    const storageKey = `bitflix_unlocked_${currentUser.walletAddress}`;
    localStorage.setItem(storageKey, JSON.stringify(newUnlockedGames));
    
    console.log('✅ Game unlocked forever:', gameId);
    console.log('💾 Saved to localStorage:', storageKey);
    console.log('📋 Current unlocked games:', newUnlockedGames);
    
    // Verify it was saved
    const verification = localStorage.getItem(storageKey);
    console.log('✔️ Verification - localStorage contains:', verification);
  };

  const handlePlayGame = (game: Game) => {
    if (game.id === '1' && game.status === 'LIVE') {
      console.log('🎮 Starting game:', game.title);
      setActiveGame(game);
    } else {
      alert(`${game.title} is coming soon!`);
    }
  };

  const handleGameEnd = (result: 'win' | 'loss', opponent: Player, amount: number) => {
    if (!currentUser) return;

    const amountWonOrLost = result === 'win' ? amount : -amount;

    // Update streak data
    const updatedStreakData = updateStreakData(
      currentUser.streakData || {
        currentWinStreak: 0,
        bestWinStreak: 0,
        currentPlayStreak: 0,
        bestPlayStreak: 0,
        lastPlayedDate: '',
        streakActive: false,
        totalGamesPlayed: 0,
      },
      result
    );

    const updatedUser: User = {
      ...currentUser,
      balance: currentUser.balance + amountWonOrLost,
      streakData: updatedStreakData,
      gameHistory: [
        {
          id: new Date().toISOString(),
          opponent,
          result,
          amount: Math.abs(amountWonOrLost),
          date: new Date().toLocaleDateString(),
        },
        ...currentUser.gameHistory,
      ],
    };
    setCurrentUser(updatedUser);
    saveProfile(updatedUser);

    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.name === opponent.name ? { ...p, balance: p.balance - amountWonOrLost } : p
      )
    );
        
    setActiveGame(null);
  };
    
  const renderContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case Tab.Home:
        return (
          <HomeScreen 
            onPlayGame={handlePlayGame}
            unlockedGames={currentUser.unlockedGames || []}
            onUnlockGame={handleUnlockGame}
          />
        );
      case Tab.Rankings:
        return <LeaderboardScreen players={players} />;
      case Tab.Profile:
        return (
          <ProfileScreen 
            user={currentUser} 
            onSignOut={handleSignOut}
          />
        );
      case Tab.Wallet:
        return <WalletScreen user={currentUser} />;
      default:
        return (
          <HomeScreen 
            onPlayGame={handlePlayGame}
            unlockedGames={currentUser.unlockedGames || []}
            onUnlockGame={handleUnlockGame}
          />
        );
    }
  };

  if (!currentUser) {
    return <EntryScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="w-[390px] h-[844px] bg-[#10131c] text-white overflow-hidden shadow-2xl rounded-3xl relative flex flex-col">
        {activeGame ? (
          <ChessGameScreen 
            game={activeGame}
            user={currentUser}
            players={players}
            onGameEnd={handleGameEnd}
            onExit={() => setActiveGame(null)}
          />
        ) : (
          <>
            <div className="flex-grow overflow-y-auto pb-20">
              {renderContent()}
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;