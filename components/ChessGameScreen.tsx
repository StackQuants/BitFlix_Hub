import React, { useState, useEffect, useCallback } from 'react';

interface Game {
  id: string;
  name: string;
  entryFee: number;
}

interface User {
  name: string;
  balance: number;
  avatarUrl: string;
}

interface Player {
  name: string;
  avatarUrl: string;
  rating?: number;
}

const WHITE_PIECES = '♔♕♖♗♘♙';
const BLACK_PIECES = '♚♛♜♝♞♟';

const getPieceColor = (piece: string | null): 'white' | 'black' | null => {
  if (!piece) return null;
  if (WHITE_PIECES.includes(piece)) return 'white';
  if (BLACK_PIECES.includes(piece)) return 'black';
  return null;
};

const getPieceType = (piece: string) => {
    const lower = piece.toLowerCase();
    if (lower === '♙' || lower === '♟') return 'pawn';
    if (lower === '♖' || lower === '♜') return 'rook';
    if (lower === '♘' || lower === '♞') return 'knight';
    if (lower === '♗' || lower === '♝') return 'bishop';
    if (lower === '♕' || lower === '♛') return 'queen';
    if (lower === '♔' || lower === '♚') return 'king';
    return null;
};

interface ChessGameScreenProps {
  game: Game;
  user: User;
  players: Player[];
  onGameEnd: (result: 'win' | 'loss', opponent: Player, amount: number) => void;
  onExit: () => void;
}

// Game Mode Selector Component
const GameModeSelector: React.FC<{
  onSelectMode: (mode: 'ai' | 'online') => void;
  gamesPlayedToday: number;
  userName: string;
  onBack: () => void; // Add back button handler
}> = ({ onSelectMode, gamesPlayedToday, userName, onBack }) => {
  const DAILY_GAME_LIMIT = 17;
  const remainingGames = DAILY_GAME_LIMIT - gamesPlayedToday;
  const [selectedMode, setSelectedMode] = useState<'ai' | 'online' | null>(null);

  const handleModeSelect = (mode: 'ai' | 'online') => {
    if (remainingGames <= 0) {
      alert('You have reached your daily game limit of 17 games. Please try again tomorrow!');
      return;
    }
    setSelectedMode(mode);
    setTimeout(() => onSelectMode(mode), 300);
  };

  return (
    <div className="h-full bg-gradient-to-br from-amber-900 via-stone-800 to-slate-900 flex items-center justify-center p-6 overflow-auto">
      <div className="max-w-2xl w-full">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-amber-200 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 font-semibold flex items-center gap-2 mb-6"
        >
          ← Back
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-100 mb-2">♔ Chess Arena ♚</h1>
          <p className="text-amber-200/70">Welcome, {userName}!</p>
          <div className="mt-4 inline-block bg-amber-950/50 backdrop-blur-sm rounded-xl px-6 py-3 border-2 border-amber-700/30">
            <p className="text-amber-200 text-sm mb-1">Games Played Today</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-amber-100">{gamesPlayedToday}</span>
              <span className="text-amber-300/50">/</span>
              <span className="text-xl text-amber-300">{DAILY_GAME_LIMIT}</span>
            </div>
            <p className={`text-xs mt-1 ${remainingGames > 5 ? 'text-green-400' : remainingGames > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {remainingGames > 0 ? `${remainingGames} games remaining` : 'Daily limit reached'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => handleModeSelect('ai')}
            disabled={remainingGames <= 0}
            className={`group relative bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              selectedMode === 'ai' ? 'ring-4 ring-purple-400' : ''
            }`}
          >
            <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <span className="text-4xl">🤖</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Play vs AI</h2>
              <p className="text-purple-100/80 text-sm mb-3">
                Challenge our intelligent chess bot
              </p>
              <div className="space-y-1 text-left text-xs text-purple-200/70">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Perfect for practice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Instant matchmaking</span>
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleModeSelect('online')}
            disabled={remainingGames <= 0}
            className={`group relative bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              selectedMode === 'online' ? 'ring-4 ring-cyan-400' : ''
            }`}
          >
            <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-3 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <span className="text-4xl">🌐</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Play Online</h2>
              <p className="text-cyan-100/80 text-sm mb-3">
                Compete against real players
              </p>
              <div className="space-y-1 text-left text-xs text-cyan-200/70">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Real human opponents</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Win FP rewards</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div className="bg-amber-950/30 backdrop-blur-sm rounded-xl p-4 border border-amber-700/20">
          <h3 className="text-amber-100 font-bold mb-2 flex items-center gap-2 text-sm">
            <span>ℹ️</span>
            <span>Daily Game Limit</span>
          </h3>
          <div className="text-amber-200/70 text-xs space-y-1">
            <p>• Play up to <strong className="text-amber-100">17 games per day</strong></p>
            <p>• Limit resets at midnight UTC</p>
          </div>
        </div>

        <div className="mt-4 bg-stone-900/50 rounded-full h-2 overflow-hidden border border-amber-700/20">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500 rounded-full"
            style={{ width: `${(gamesPlayedToday / DAILY_GAME_LIMIT) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const ChessSquare: React.FC<{ 
  isBlack: boolean; 
  piece: string | null; 
  isSelected: boolean;
  isPossibleMove: boolean;
  isLastMove: boolean;
  isCheck: boolean;
  onClick: () => void;
}> = ({ isBlack, piece, isSelected, isPossibleMove, isLastMove, isCheck, onClick }) => {
  const bgColor = isBlack ? 'bg-[#b58863]' : 'bg-[#f0d9b5]';
  const pieceColor = getPieceColor(piece) === 'black' ? 'text-gray-900' : 'text-gray-100';
  
  return (
    <div 
      className={`w-full aspect-square flex justify-center items-center ${bgColor} relative cursor-pointer group transition-all duration-200`}
      onClick={onClick}
      style={{
        backgroundImage: isBlack 
          ? 'linear-gradient(45deg, #b58863 0%, #a67c52 100%)' 
          : 'linear-gradient(45deg, #f0d9b5 0%, #e8d5b7 100%)'
      }}
    >
      {piece && (
        <span 
          className={`text-4xl select-none ${pieceColor} transition-transform duration-100 ${isSelected ? 'scale-110' : ''} group-hover:scale-105`} 
          style={{ 
            textShadow: getPieceColor(piece) === 'black' 
              ? '0 2px 4px rgba(0,0,0,0.4), 0 0 2px rgba(255,255,255,0.3)' 
              : '0 2px 4px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.5)',
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
          }}
        >
          {piece}
        </span>
      )}
      {isSelected && <div className="absolute inset-0 bg-yellow-400/40 ring-2 ring-yellow-500"></div>}
      {isPossibleMove && !piece && <div className="absolute inset-1/3 aspect-square rounded-full bg-green-600/50 shadow-lg"></div>}
      {isPossibleMove && piece && <div className="absolute inset-0 ring-4 ring-inset ring-red-600/60 rounded-sm"></div>}
      {isLastMove && <div className="absolute inset-0 bg-yellow-400/25"></div>}
      {isCheck && <div className="absolute inset-0 bg-red-600/70 animate-pulse"></div>}
    </div>
  );
};

const ChessGameScreen: React.FC<ChessGameScreenProps> = ({ game, user, players, onGameEnd, onExit }) => {
  const DAILY_GAME_LIMIT = 17;
  
  // State for game mode selection
  const [gameMode, setGameMode] = useState<'ai' | 'online' | null>(null);
  const [gamesPlayedToday, setGamesPlayedToday] = useState(0);
  
  // Load games played from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('chessGamesData');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        setGamesPlayedToday(data.count);
      } else {
        // Reset if it's a new day
        localStorage.setItem('chessGamesData', JSON.stringify({ date: today, count: 0 }));
        setGamesPlayedToday(0);
      }
    } else {
      localStorage.setItem('chessGamesData', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);
  
  const remainingGames = DAILY_GAME_LIMIT - gamesPlayedToday;
  const initialBoard = [
    '♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜',
    '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟',
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    null, null, null, null, null, null, null, null,
    '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙',
    '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖',
  ];
  
  const [board, setBoard] = useState<(string | null)[]>(initialBoard);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<number[]>([]);
  const [turn, setTurn] = useState<'white' | 'black'>('white');
  const [opponent, setOpponent] = useState<Player>({
    name: 'AI Opponent',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai',
    rating: 1200
  });
  const [gameOver, setGameOver] = useState<{winner: 'white' | 'black' | 'draw' | null, reason?: string}>({winner: null});
  const [moveHistory, setMoveHistory] = useState<{from: number, to: number}[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<{white: string[], black: string[]}>({white: [], black: []});
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes in seconds
  const [blackTime, setBlackTime] = useState(600);
  const [isInCheck, setIsInCheck] = useState<'white' | 'black' | null>(null);
  const [moveCount, setMoveCount] = useState(0);
  const [whiteKingMoved, setWhiteKingMoved] = useState(false);
  const [blackKingMoved, setBlackKingMoved] = useState(false);
  const [whiteRooksMoved, setWhiteRooksMoved] = useState({ left: false, right: false });
  const [blackRooksMoved, setBlackRooksMoved] = useState({ left: false, right: false });

  // Back button handler for mode selector
  const handleBackFromModeSelector = () => {
    onExit(); // This will exit back to the previous screen
  };

  useEffect(() => {
    if (players && players.length > 0 && user) {
      if (gameMode === 'online') {
        // For online mode, match with real players
        const possibleOpponents = players.filter(p => p.name !== user.name);
        if (possibleOpponents.length > 0) {
          setOpponent(possibleOpponents[Math.floor(Math.random() * possibleOpponents.length)]);
        } else {
          setOpponent({
            name: 'Waiting for player...',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=waiting',
            rating: 1200
          });
        }
      } else {
        // For AI mode, use AI opponent
        setOpponent({
          name: 'AI Opponent',
          avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=ai',
          rating: 1200
        });
      }
    }
  }, [user, players, gameMode]);

  // Timer countdown
  useEffect(() => {
    if (gameOver.winner) return;
    
    const interval = setInterval(() => {
      if (turn === 'white') {
        setWhiteTime(prev => {
          if (prev <= 0) {
            setGameOver({ winner: 'black', reason: 'White ran out of time' });
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime(prev => {
          if (prev <= 0) {
            setGameOver({ winner: 'white', reason: 'Black ran out of time' });
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [turn, gameOver.winner]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const findKing = useCallback((color: 'white' | 'black', currentBoard: (string | null)[]) => {
    const kingPiece = color === 'white' ? '♔' : '♚';
    return currentBoard.findIndex(p => p === kingPiece);
  }, []);

  const isSquareUnderAttack = useCallback((targetIndex: number, byColor: 'white' | 'black', currentBoard: (string | null)[]) => {
    for (let i = 0; i < 64; i++) {
      const piece = currentBoard[i];
      if (piece && getPieceColor(piece) === byColor) {
        const moves = calculatePossibleMovesRaw(i, currentBoard, true);
        if (moves.includes(targetIndex)) return true;
      }
    }
    return false;
  }, []);

  const calculatePossibleMovesRaw = useCallback((startIndex: number, currentBoard: (string | null)[], ignoreCheck = false) => {
    const piece = currentBoard[startIndex];
    if (!piece) return [];
    
    const moves: number[] = [];
    const startRow = Math.floor(startIndex / 8);
    const startCol = startIndex % 8;
    const pieceColor = getPieceColor(piece);
    const pieceType = getPieceType(piece);

    const checkLine = (dr: number, dc: number) => {
      for (let i = 1; i < 8; i++) {
        const newRow = startRow + i * dr;
        const newCol = startCol + i * dc;
        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;
        const targetIndex = newRow * 8 + newCol;
        const targetPiece = currentBoard[targetIndex];
        if (targetPiece) {
          if (getPieceColor(targetPiece) !== pieceColor) moves.push(targetIndex);
          break;
        } else {
          moves.push(targetIndex);
        }
      }
    };

    switch(pieceType) {
        case 'pawn':
            const dir = pieceColor === 'white' ? -1 : 1;
            const newRow = startRow + dir;
            
            // Forward one
            if (newRow >= 0 && newRow < 8 && !currentBoard[newRow * 8 + startCol]) {
                moves.push(newRow * 8 + startCol);
                
                // Forward two (initial move)
                const isInitialPos = pieceColor === 'white' ? startRow === 6 : startRow === 1;
                if (isInitialPos && !currentBoard[(startRow + 2 * dir) * 8 + startCol]) {
                    moves.push((startRow + 2 * dir) * 8 + startCol);
                }
            }
            
            // Captures
            [-1, 1].forEach(cdir => {
                if (startCol + cdir >= 0 && startCol + cdir < 8 && newRow >= 0 && newRow < 8) {
                    const targetIndex = newRow * 8 + (startCol + cdir);
                    const targetPiece = currentBoard[targetIndex];
                    if (targetPiece && getPieceColor(targetPiece) !== pieceColor) {
                        moves.push(targetIndex);
                    }
                }
            });
            break;
            
        case 'rook':
            [[-1,0], [1,0], [0,-1], [0,1]].forEach(([dr, dc]) => checkLine(dr, dc));
            break;
            
        case 'knight':
            [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(([dr,dc]) => {
                const newRow = startRow + dr;
                const newCol = startCol + dc;
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    const targetIndex = newRow * 8 + newCol;
                    const targetPiece = currentBoard[targetIndex];
                    if (!targetPiece || getPieceColor(targetPiece) !== pieceColor) {
                        moves.push(targetIndex);
                    }
                }
            });
            break;
            
        case 'bishop':
            [[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr, dc]) => checkLine(dr, dc));
            break;
            
        case 'queen':
            [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr, dc]) => checkLine(dr, dc));
            break;
            
        case 'king':
            [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]].forEach(([dr,dc]) => {
                const newRow = startRow + dr;
                const newCol = startCol + dc;
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    const targetIndex = newRow * 8 + newCol;
                    const targetPiece = currentBoard[targetIndex];
                    if (!targetPiece || getPieceColor(targetPiece) !== pieceColor) {
                        moves.push(targetIndex);
                    }
                }
            });
            
            // Castling
            if (!ignoreCheck && pieceColor) {
                const kingMoved = pieceColor === 'white' ? whiteKingMoved : blackKingMoved;
                const rooksMoved = pieceColor === 'white' ? whiteRooksMoved : blackRooksMoved;
                
                if (!kingMoved && !isSquareUnderAttack(startIndex, pieceColor === 'white' ? 'black' : 'white', currentBoard)) {
                    // Kingside castling
                    if (!rooksMoved.right) {
                        const e1 = startIndex + 1;
                        const f1 = startIndex + 2;
                        const g1 = startIndex + 3;
                        if (!currentBoard[e1] && !currentBoard[f1] && currentBoard[g1] && getPieceType(currentBoard[g1]!) === 'rook') {
                            if (!isSquareUnderAttack(e1, pieceColor === 'white' ? 'black' : 'white', currentBoard) &&
                                !isSquareUnderAttack(f1, pieceColor === 'white' ? 'black' : 'white', currentBoard)) {
                                moves.push(f1);
                            }
                        }
                    }
                    
                    // Queenside castling
                    if (!rooksMoved.left) {
                        const d1 = startIndex - 1;
                        const c1 = startIndex - 2;
                        const b1 = startIndex - 3;
                        const a1 = startIndex - 4;
                        if (!currentBoard[d1] && !currentBoard[c1] && !currentBoard[b1] && currentBoard[a1] && getPieceType(currentBoard[a1]!) === 'rook') {
                            if (!isSquareUnderAttack(d1, pieceColor === 'white' ? 'black' : 'white', currentBoard) &&
                                !isSquareUnderAttack(c1, pieceColor === 'white' ? 'black' : 'white', currentBoard)) {
                                moves.push(c1);
                            }
                        }
                    }
                }
            }
            break;
    }
    
    return moves;
  }, [whiteKingMoved, blackKingMoved, whiteRooksMoved, blackRooksMoved, isSquareUnderAttack]);

  const calculatePossibleMoves = useCallback((startIndex: number, currentBoard: (string | null)[]) => {
    const rawMoves = calculatePossibleMovesRaw(startIndex, currentBoard);
    const piece = currentBoard[startIndex];
    if (!piece) return [];
    
    const pieceColor = getPieceColor(piece);
    if (!pieceColor) return [];
    
    // Filter out moves that would leave king in check
    return rawMoves.filter(moveIndex => {
      const testBoard = [...currentBoard];
      testBoard[moveIndex] = testBoard[startIndex];
      testBoard[startIndex] = null;
      
      const kingIndex = findKing(pieceColor, testBoard);
      if (kingIndex === -1) return false;
      
      return !isSquareUnderAttack(kingIndex, pieceColor === 'white' ? 'black' : 'white', testBoard);
    });
  }, [calculatePossibleMovesRaw, findKing, isSquareUnderAttack]);

  const checkGameOver = useCallback((currentBoard: (string|null)[], currentTurn: 'white' | 'black') => {
      const whiteKingExists = currentBoard.some(p => p === '♔');
      const blackKingExists = currentBoard.some(p => p === '♚');

      if (!whiteKingExists) {
        setGameOver({ winner: 'black', reason: 'Checkmate' });
        return true;
      }
      if (!blackKingExists) {
        setGameOver({ winner: 'white', reason: 'Checkmate' });
        return true;
      }
      
      // Check for stalemate or checkmate
      let hasLegalMove = false;
      for (let i = 0; i < 64; i++) {
        const piece = currentBoard[i];
        if (piece && getPieceColor(piece) === currentTurn) {
          const moves = calculatePossibleMoves(i, currentBoard);
          if (moves.length > 0) {
            hasLegalMove = true;
            break;
          }
        }
      }
      
      if (!hasLegalMove) {
        const kingIndex = findKing(currentTurn, currentBoard);
        const inCheck = isSquareUnderAttack(kingIndex, currentTurn === 'white' ? 'black' : 'white', currentBoard);
        
        if (inCheck) {
          setGameOver({ winner: currentTurn === 'white' ? 'black' : 'white', reason: 'Checkmate' });
        } else {
          setGameOver({ winner: 'draw', reason: 'Stalemate' });
        }
        return true;
      }
      
      return false;
  }, [calculatePossibleMoves, findKing, isSquareUnderAttack]);
  
  const makeOpponentMove = useCallback(() => {
    const allBlackMoves: { from: number; to: number; score: number }[] = [];
    
    for (let i = 0; i < 64; i++) {
        if (getPieceColor(board[i]) === 'black') {
            const moves = calculatePossibleMoves(i, board);
            moves.forEach(to => {
              let score = Math.random();
              // Prioritize captures
              if (board[to]) score += 10;
              // Prioritize center control
              const row = Math.floor(to / 8);
              const col = to % 8;
              if (row >= 2 && row <= 5 && col >= 2 && col <= 5) score += 2;
              
              allBlackMoves.push({ from: i, to, score });
            });
        }
    }
    
    if (allBlackMoves.length === 0) return;

    // Sort by score and pick best move
    allBlackMoves.sort((a, b) => b.score - a.score);
    const bestMove = allBlackMoves[0];
    
    const newBoard = [...board];
    const capturedPiece = newBoard[bestMove.to];
    
    // Handle castling
    const movingPiece = newBoard[bestMove.from];
    if (movingPiece === '♚' && Math.abs(bestMove.to - bestMove.from) === 2) {
      if (bestMove.to > bestMove.from) {
        newBoard[bestMove.from + 1] = newBoard[bestMove.from + 3];
        newBoard[bestMove.from + 3] = null;
      } else {
        newBoard[bestMove.from - 1] = newBoard[bestMove.from - 4];
        newBoard[bestMove.from - 4] = null;
      }
    }
    
    newBoard[bestMove.to] = board[bestMove.from];
    newBoard[bestMove.from] = null;
    
    if (capturedPiece) {
      setCapturedPieces(prev => ({...prev, black: [...prev.black, capturedPiece]}));
    }
    
    setBoard(newBoard);
    setMoveHistory(prev => [...prev, {from: bestMove.from, to: bestMove.to}]);
    setMoveCount(prev => prev + 1);
    
    // Check if white king is in check
    const whiteKingIndex = findKing('white', newBoard);
    if (isSquareUnderAttack(whiteKingIndex, 'black', newBoard)) {
      setIsInCheck('white');
    } else {
      setIsInCheck(null);
    }
    
    if (!checkGameOver(newBoard, 'white')) {
        setTurn('white');
    }
  }, [board, checkGameOver, calculatePossibleMoves, findKing, isSquareUnderAttack]);

  useEffect(() => {
    if (turn === 'black' && !gameOver.winner) {
      const timer = setTimeout(makeOpponentMove, 800);
      return () => clearTimeout(timer);
    }
  }, [turn, gameOver.winner, makeOpponentMove]);
  
  useEffect(() => {
    if (gameOver.winner && opponent) {
        const result = gameOver.winner === 'white' ? 'win' : (gameOver.winner === 'draw' ? 'loss' : 'loss');
        
        // Increment games played count
        const today = new Date().toDateString();
        const stored = localStorage.getItem('chessGamesData');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.date === today) {
            localStorage.setItem('chessGamesData', JSON.stringify({ 
              date: today, 
              count: data.count + 1 
            }));
          }
        }
        
        setTimeout(() => {
           onGameEnd(result, opponent, gameOver.winner === 'white' ? 5 : 0);

        }, 3000);
    }
  }, [gameOver.winner, game.entryFee, onGameEnd, opponent]);
  
  useEffect(() => {
    if (selectedPieceIndex !== null) {
        setPossibleMoves(calculatePossibleMoves(selectedPieceIndex, board));
    } else {
        setPossibleMoves([]);
    }
  }, [selectedPieceIndex, board, calculatePossibleMoves]);

  const handleSquareClick = (index: number) => {
    if (gameOver.winner || turn !== 'white') return;

    if (selectedPieceIndex !== null) {
        if (possibleMoves.includes(index)) {
            const newBoard = [...board];
            const capturedPiece = newBoard[index];
            const movingPiece = newBoard[selectedPieceIndex];
            
            // Handle castling
            if (movingPiece === '♔' && Math.abs(index - selectedPieceIndex) === 2) {
              if (index > selectedPieceIndex) {
                newBoard[selectedPieceIndex + 1] = newBoard[selectedPieceIndex + 3];
                newBoard[selectedPieceIndex + 3] = null;
              } else {
                newBoard[selectedPieceIndex - 1] = newBoard[selectedPieceIndex - 4];
                newBoard[selectedPieceIndex - 4] = null;
              }
              setWhiteKingMoved(true);
            }
            
            // Track king and rook movements
            if (movingPiece === '♔') setWhiteKingMoved(true);
            if (movingPiece === '♖' && selectedPieceIndex === 63) setWhiteRooksMoved(prev => ({...prev, right: true}));
            if (movingPiece === '♖' && selectedPieceIndex === 56) setWhiteRooksMoved(prev => ({...prev, left: true}));
            
            newBoard[index] = board[selectedPieceIndex];
            newBoard[selectedPieceIndex] = null;
            
            if (capturedPiece) {
              setCapturedPieces(prev => ({...prev, white: [...prev.white, capturedPiece]}));
            }
            
            setBoard(newBoard);
            setMoveHistory(prev => [...prev, {from: selectedPieceIndex, to: index}]);
            setMoveCount(prev => prev + 1);
            setSelectedPieceIndex(null);
            
            // Check if black king is in check
            const blackKingIndex = findKing('black', newBoard);
            if (isSquareUnderAttack(blackKingIndex, 'white', newBoard)) {
              setIsInCheck('black');
            } else {
              setIsInCheck(null);
            }
            
            if(!checkGameOver(newBoard, 'black')) {
                setTurn('black');
            }
        } else {
            if (getPieceColor(board[index]) === 'white') {
                setSelectedPieceIndex(index);
            } else {
                setSelectedPieceIndex(null);
            }
        }
    } else {
      if (getPieceColor(board[index]) === 'white') {
        setSelectedPieceIndex(index);
      }
    }
  };

  const lastMove = moveHistory[moveHistory.length - 1];
  const whiteKingIndex = findKing('white', board);
  const blackKingIndex = findKing('black', board);

  // Show mode selector if no mode selected
  if (!gameMode) {
    return (
      <GameModeSelector
        onSelectMode={(mode) => {
          if (remainingGames > 0) {
            setGameMode(mode);
          }
        }}
        gamesPlayedToday={gamesPlayedToday}
        userName={user.name}
        onBack={handleBackFromModeSelector}
      />
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-amber-900 via-stone-800 to-slate-900 relative">
      <header className="flex items-center justify-between p-4 flex-shrink-0 z-10 bg-black/30 backdrop-blur-sm">
        <button 
          onClick={onExit} 
          className="text-amber-200 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5 font-semibold flex items-center gap-2"
        >
          ← Forfeit
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-amber-100">Move {Math.ceil(moveCount / 2)}</h1>
          <p className="text-xs text-amber-300/70">{gameMode === 'ai' ? 'vs AI' : 'Online Match'}</p>
          {isInCheck && <p className="text-red-400 text-xs animate-pulse font-bold">CHECK!</p>}
        </div>
        <div className="text-right">
          <p className="text-xs text-amber-200">Games Today</p>
          <p className="text-sm font-bold text-amber-100">{gamesPlayedToday}/{DAILY_GAME_LIMIT}</p>
        </div>
      </header>

      {/* Black Player Info */}
      <div className="px-4 pb-2">
        <div className={`flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-3 transition-all duration-300 ${turn === 'black' ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20' : 'opacity-60'}`}>
          <div className="flex items-center space-x-3">
            <img src={opponent.avatarUrl} alt={opponent.name} className="w-10 h-10 rounded-full border-2 border-slate-600" />
            <div>
              <p className="font-bold text-sm text-white">{opponent.name}</p>
              <p className="text-xs text-gray-400">Rating: {opponent.rating || 1200}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`font-mono text-xl font-bold ${blackTime < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {formatTime(blackTime)}
            </div>
            <div className="flex gap-1 justify-end mt-1">
              {capturedPieces.black.map((piece, i) => (
                <span key={i} className="text-xs opacity-70">{piece}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div 
          className="w-full max-w-[360px] aspect-square grid grid-cols-8 grid-rows-8 shadow-2xl rounded-xl overflow-hidden border-8 border-amber-950"
          style={{
            boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(139,69,19,0.3)'
          }}
        >
          {board.map((piece, index) => {
            const row = Math.floor(index / 8);
            const col = index % 8;
            const isBlack = (row + col) % 2 !== 0;
            const isLastMoveSquare = lastMove && (lastMove.from === index || lastMove.to === index);
            const isCheckSquare = (isInCheck === 'white' && index === whiteKingIndex) || (isInCheck === 'black' && index === blackKingIndex);
            
            return (
              <ChessSquare 
                key={index} 
                isBlack={isBlack} 
                piece={piece} 
                isSelected={selectedPieceIndex === index}
                isPossibleMove={possibleMoves.includes(index)}
                isLastMove={!!isLastMoveSquare}
                isCheck={isCheckSquare}
                onClick={() => handleSquareClick(index)} 
              />
            );
          })}
        </div>
      </main>

      {/* White Player Info */}
      <div className="px-4 pt-2 pb-4">
        <div className={`flex items-center justify-between bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-3 transition-all duration-300 ${turn === 'white' ? 'ring-2 ring-cyan-400 shadow-lg shadow-cyan-500/20' : 'opacity-60'}`}>
          <div className="text-left">
            <div className={`font-mono text-xl font-bold ${whiteTime < 60 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
              {formatTime(whiteTime)}
            </div>
            <div className="flex gap-1 mt-1">
              {capturedPieces.white.map((piece, i) => (
                <span key={i} className="text-xs opacity-70">{piece}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-bold text-sm text-white">{user.name}</p>
              <p className="text-xs text-gray-400">Rating: 1200</p>
            </div>
            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-slate-600" />
          </div>
        </div>
      </div>
      
      {gameOver.winner && (
        <div className="absolute inset-0 bg-black/80 flex justify-center items-center z-20 backdrop-blur-md">
            <div className="text-center bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border-2 border-slate-700 shadow-2xl">
                <h2 className="text-5xl font-bold mb-3">
                    {gameOver.winner === 'white' ? "🏆 Victory!" : gameOver.winner === 'black' ? "💔 Defeat" : "🤝 Draw"}
                </h2>
                <p className="text-lg mb-4 text-gray-300">{gameOver.reason}</p>
                <p className={`text-3xl font-bold ${gameOver.winner === 'white' ? 'text-green-400' : gameOver.winner === 'draw' ? 'text-yellow-400' : 'text-red-400'}`}>
                 {gameOver.winner === 'white' ? '+' : gameOver.winner === 'draw' ? '' : ''}{gameOver.winner === 'white' ? '5' : '0'} FP
                </p>
            </div>
        </div>
      )}

    </div>
  );
};

export default ChessGameScreen;