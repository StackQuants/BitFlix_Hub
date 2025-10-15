import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface BitflixChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const BitflixChatbot: React.FC<BitflixChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Bitflix AI Assistant. I can help you with earning Flix Points (FP), wallet connections, leaderboard info, game guidelines, and more! What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();
    
    // Extract name if user introduces themselves
    if ((message.includes('my name is') || message.includes("i'm") || message.includes("i am")) && 
        !message.includes('what') && !message.includes('who')) {
      const nameMatch = userMessage.match(/(?:my name is|i'm|i am)\s+([a-zA-Z]+)/i);
      if (nameMatch && nameMatch[1]) {
        const name = nameMatch[1];
        setUserName(name);
        return `👋 Hello ${name}! It's lovely to meet you!\n\nI'm your Bitflix assistant here to help you with gaming, earning FP, and improving your skills. What would you like to know about our platform?`;
      }
    }
    
    // Personalized greeting if we know the user's name
    if (userName && (message.includes('hello') || message.includes('hi') || message.includes('hey'))) {
      return `👋 Hello again ${userName}! Great to see you back!\n\nHow can I help you with Bitflix today?`;
    }
    
    // Handle greetings and casual conversation
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || 
        message.includes('greetings') || message.includes('howdy') || message === 'hey' || message === 'hi') {
      return "👋 Hello there! Welcome to Bitflix!\n\n" +
             "I'm your AI assistant here to help you with:\n\n" +
             "💰 Earning FP — Ways to earn on Bitflix\n" +
             "🔗 Wallet Connection — How to connect your wallet\n" +
             "🏆 Leaderboard — Top players and ranking system\n" +
             "♟️ Game Guidelines — Chess rules and strategies\n" +
             "🎯 Tournaments — Live and upcoming events\n" +
             "📊 Rating System — How skill levels work\n\n" +
             "What would you like to know about today?";
    }
    
    // Handle "how are you" type questions
    if (message.includes('how are you') || message.includes("how's it going") || 
        message.includes("what's up") || message.includes('how do you do')) {
      return "I'm doing wonderful! 😊 Ready to help you navigate Bitflix and maximize your FP earnings.\n\n" +
             "Whether you want to learn about earning FP, connecting your wallet, or improving your chess game, I'm here to help!\n\n" +
             "What can I assist you with today?";
    }
    
    // Handle thanks/gratitude
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate') || 
        message.includes('gracias') || message.includes('merci')) {
      const thankYouResponses = [
        "You're most welcome! I'm always happy to help you succeed on Bitflix! 🎯",
        "My pleasure! 😊 Remember, I'm here whenever you need guidance on your Bitflix journey!",
        "You're very welcome! Wishing you great success and big FP earnings! 💫",
        "Happy to help! 🚀 Let me know if there's anything else about Bitflix you'd like to know!",
        "Anytime! 😄 I'm here to make your Bitflix experience amazing and profitable!"
      ];
      return thankYouResponses[Math.floor(Math.random() * thankYouResponses.length)];
    }
    
    // Handle compliments
    if (message.includes('good bot') || message.includes('great help') || message.includes('awesome') || 
        message.includes('amazing') || message.includes('helpful')) {
      return "Thank you so much! 😊 I'm thrilled to be helping you on your Bitflix journey!\n\n" +
             "Is there anything else I can assist you with to make your gaming experience even better?";
    }
    
    // Handle "who are you" questions
    if (message.includes('who are you') || message.includes('what are you')) {
      return "I'm the Bitflix AI Assistant! 🤖\n\n" +
             "I'm here to help you:\n" +
             "• Understand how to earn FP on our platform\n" +
             "• Connect and secure your wallet\n" +
             "• Climb the leaderboards\n" +
             "• Master chess strategies\n" +
             "• Join exciting tournaments\n" +
             "• Understand the rating system\n\n" +
             "Think of me as your personal guide to success on Bitflix!";
    }

    // Handle goodbye/farewell
    if (message.includes('bye') || message.includes('goodbye') || message.includes('see you') || message.includes('farewell')) {
      const goodbyeResponses = [
        `👋 Goodbye${userName ? ` ${userName}` : ''}! It was fantastic chatting with you! Wishing you big wins and FP earnings! 🎯`,
        `Take care${userName ? ` ${userName}` : ''}! Remember, I'm always here when you need Bitflix guidance. Good luck with your games! 🚀`,
        `Until next time${userName ? ` ${userName}` : ''}! May your chess moves be brilliant and your FP wallet grow! 💫`
      ];
      return goodbyeResponses[Math.floor(Math.random() * goodbyeResponses.length)];
    }

    // Earning points responses
    if (message.includes('earn') || message.includes('points') || message.includes('income') || 
        message.includes('make money') || message.includes('get fp') || message.includes('rewards') ||
        message.includes('flix points')) {
      return "💰 Ways to Earn FP on Bitflix:\n\n" +
             "1. Win Chess Games — Earn FP by defeating opponents\n" +
             "2. Tournament Prizes — Compete for bigger rewards\n" +
             "3. Daily Challenges — Complete tasks for bonus FP\n" +
             "4. Referral Program — Invite friends, earn 10% of their winnings\n" +
             "5. Leaderboard Rewards — Top players get weekly bonuses\n" +
             "6. Achievement Bonuses — Unlock achievements for rewards\n" +
             "7. Win Streaks — Consecutive wins give multiplier bonuses\n" +
             "8. Weekly Quests — Complete missions for extra FP\n\n" +
             "Start by playing chess games with entry fees as low as 50 FP!\n\n" +
             "Would you like to know about:\n" +
             "• Connecting your Stacks wallet 🔗\n" +
             "• Understanding the leaderboard and rating system 🏆\n" +
             "• Chess strategies and game improvements ♟️\n" +
             "• Tournament schedules and prize pools 🎯\n" +
             "• Converting FP to STX tokens 💸";
    }
    
    // Wallet connection responses
    if (message.includes('wallet') || message.includes('connect') || message.includes('stacks') || 
        message.includes('crypto') || message.includes('hiro') || message.includes('xverse') || 
        message.includes('leather')) {
      return "🔗 Wallet Connection Guide:\n\n" +
             "Supported Stacks Wallets:\n" +
             "• Hiro Wallet\n" +
             "• Xverse Wallet\n" +
             "• Leather Wallet\n\n" +
             "How to Connect:\n" +
             "1. Click the 'Connect Wallet' button\n" +
             "2. Select your preferred Stacks wallet\n" +
             "3. Approve the connection\n" +
             "4. Start earning FP!\n\n" +
             "Security Note: Your private keys never leave your wallet. We only read your public address for transactions.\n\n" +
             "Would you like to know about:\n" +
             "• Earning FP through chess and tournaments 💰\n" +
             "• Understanding the leaderboard and rating system 🏆\n" +
             "• Chess strategies and game improvements ♟️\n" +
             "• Tournament schedules and prize pools 🎯\n" +
             "• Converting FP to STX tokens 💰";
    }
    
    // Leaderboard responses
    if (message.includes('leaderboard') || message.includes('ranking') || message.includes('top') || 
        message.includes('best players') || message.includes('high score')) {
      return "🏆 Leaderboard Information:\n\n" +
             "Current Top Players:\n" +
             "1. CryptoKing — 2400 rating — 5,420 FP\n" +
             "2. BitcoinQueen — 2200 rating — 4,850 FP\n" +
             "3. StacksMaster — 2000 rating — 3,720 FP\n\n" +
             "How Rankings Work:\n" +
             "• Based on chess rating (1200-2400+)\n" +
             "• Win rate percentage\n" +
             "• Total FP earned\n" +
             "• Recent performance\n" +
             "• Tournament results\n\n" +
             "Weekly Rewards:\n" +
             "• Top 10: 100 FP bonus\n" +
             "• Top 5: 200 FP bonus\n" +
             "• Top 3: 500 FP bonus\n" +
             "• #1: 1,000 FP bonus\n\n" +
             "Would you like to know about:\n" +
             "• Ways to earn more FP 💰\n" +
             "• Understanding the rating system 📊\n" +
             "• Chess strategies to improve your rank ♟️\n" +
             "• Joining tournaments for bigger prizes 🎯\n" +
             "• Connecting your wallet 🔗";
    }
    
    // Game guidelines responses
    if (message.includes('game') || message.includes('chess') || message.includes('rules') || 
        message.includes('how to play') || message.includes('strategy') || message.includes('opening') ||
        message.includes('tactics')) {
      return "♟️ Chess Game Guidelines:\n\n" +
             "Basic Rules:\n" +
             "• White moves first\n" +
             "• Capture by moving to opponent's square\n" +
             "• King cannot be captured (check/checkmate only)\n" +
             "• Win by checkmate or opponent timeout\n\n" +
             "Time Controls:\n" +
             "• 5 min (Blitz) — Fast-paced\n" +
             "• 10 min (Rapid) — Balanced\n" +
             "• 15 min (Standard) — Strategic\n" +
             "• 20 min (Classic) — Deep thinking\n\n" +
             "Beginner Tips:\n" +
             "• Control the center squares\n" +
             "• Develop knights and bishops early\n" +
             "• Castle for king safety\n" +
             "• Don't move the same piece repeatedly\n" +
             "• Watch your time management!\n\n" +
             "Advanced Strategies:\n" +
             "• Learn basic openings (Italian, Sicilian)\n" +
             "• Study endgame techniques\n" +
             "• Practice tactical puzzles\n" +
             "• Analyze your games to improve\n\n" +
             "Would you like to know about:\n" +
             "• Ways to earn FP through chess 💰\n" +
             "• Joining tournaments for practice 🎯\n" +
             "• Understanding the rating system 📊\n" +
             "• Checking the leaderboard rankings 🏆\n" +
             "• Connecting your wallet to start playing 🔗";
    }
    
    // Tournament responses
    if (message.includes('tournament') || message.includes('upcoming') || message.includes('competition') || 
        message.includes('event') || message.includes('championship')) {
      return "🏆 Tournament Information:\n\n" +
             "Live Tournaments:\n" +
             "• Chess Championship — 50 FP entry\n" +
             "• 2,847 active players\n" +
             "• Prize pool: 10,000 FP\n\n" +
             "Upcoming Tournaments:\n" +
             "• Blitz Battle — 5min games — Starting tomorrow\n" +
             "• Grandmaster Challenge — 30min games — Next week\n" +
             "• Weekend Warrior — Special Saturday event\n\n" +
             "Tournament Features:\n" +
             "• Skill-based matchmaking\n" +
             "• Real-time leaderboards\n" +
             "• Live streaming with commentary\n" +
             "• Prize pools up to 50,000 FP\n\n" +
             "Join tournaments to compete for bigger prizes and test your skills!\n\n" +
             "Would you like to know about:\n" +
             "• Chess strategies to win tournaments ♟️\n" +
             "• Understanding the rating system 📊\n" +
             "• Other ways to earn FP 💰\n" +
             "• Checking leaderboard rankings 🏆\n" +
             "• Converting your tournament winnings to STX 💰";
    }
    
    // Rating system responses
    if (message.includes('rating') || message.includes('skill') || message.includes('level') || 
        message.includes('elo') || message.includes('rank')) {
      return "📊 Rating System:\n\n" +
             "Rating Ranges:\n" +
             "• 1200-1400: Beginner\n" +
             "• 1400-1600: Novice\n" +
             "• 1600-1800: Intermediate\n" +
             "• 1800-2000: Advanced\n" +
             "• 2000-2200: Expert\n" +
             "• 2200+: Master\n\n" +
             "How Ratings Work:\n" +
             "• Start at 1200\n" +
             "• Win against higher-rated = more points\n" +
             "• Lose to lower-rated = lose more points\n" +
             "• Filter opponents by rating level\n" +
             "• Rating updates after each game\n\n" +
             "Challenge stronger players to improve faster and climb the ranks!\n\n" +
             "Would you like to know about:\n" +
             "• Chess strategies to improve your rating ♟️\n" +
             "• Checking leaderboard rankings 🏆\n" +
             "• Joining tournaments to test your skills 🎯\n" +
             "• Ways to earn more FP 💰\n" +
             "• Platform security features 🛡️";
    }

    // Security and trust responses
    if (message.includes('secure') || message.includes('safe') || message.includes('trust') || 
        message.includes('scam') || message.includes('legit')) {
      return "🛡️ Security & Trust:\n\n" +
             "Bitflix is 100% legitimate and secure:\n" +
             "• Non-custodial platform — Your FP stays in your account\n" +
             "• Smart contract audited by third parties\n" +
             "• Transparent game outcomes on blockchain\n" +
             "• Instant FP to STX conversion\n" +
             "• 24/7 customer support\n" +
             "• Thousands of verified players\n\n" +
             "Your funds and data are always protected!\n\n" +
             "Would you like to know about:\n" +
             "• Connecting your wallet securely 🔗\n" +
             "• How FP to STX conversion works 💰\n" +
             "• Ways to earn FP safely 💰\n" +
             "• Playing on mobile devices 📱\n" +
             "• Joining tournaments 🎯";
    }

    // Conversion responses
    if (message.includes('convert') || message.includes('exchange') || message.includes('redeem') || 
        message.includes('fp to stx') || message.includes('transfer')) {
      return "💰 FP to STX Conversion:\n\n" +
             "How to Convert FP to STX:\n" +
             "1. Go to your wallet dashboard\n" +
             "2. Click 'Convert FP to STX'\n" +
             "3. Enter FP amount and confirm\n" +
             "4. STX sent instantly to your wallet\n\n" +
             "Conversion Rates:\n" +
             "• 100 FP = 1 STX\n" +
             "• Minimum: 1,000 FP\n" +
             "• Maximum: No limit\n" +
             "• Fees: Zero conversion fees!\n" +
             "• Processing: Instant blockchain confirmation\n\n" +
             "Your FP earnings can be converted to real STX tokens anytime!\n\n" +
             "Would you like to know about:\n" +
             "• More ways to earn FP 💰\n" +
             "• Platform security features 🛡️\n" +
             "• Connecting your wallet 🔗\n" +
             "• Checking your leaderboard rank 🏆\n" +
             "• Joining tournaments for bigger prizes 🎯";
    }

    // Mobile app responses
    if (message.includes('mobile') || message.includes('app') || message.includes('phone') || 
        message.includes('download') || message.includes('ios') || message.includes('android')) {
      return "📱 Mobile Experience:\n\n" +
             "Bitflix Mobile Features:\n" +
             "• Full mobile-optimized website\n" +
             "• Native app coming soon!\n" +
             "• Play chess on the go\n" +
             "• Push notifications for tournaments\n" +
             "• Mobile wallet connections\n" +
             "• Touch-friendly interface\n\n" +
             "Access Bitflix from any device with an internet connection!\n\n" +
             "Would you like to know about:\n" +
             "• Connecting your wallet on mobile 🔗\n" +
             "• Ways to earn FP 💰\n" +
             "• Chess strategies for mobile play ♟️\n" +
             "• Joining mobile-friendly tournaments 🎯\n" +
             "• Platform security 🛡️";
    }

    // General help
    if (message.includes('help') || message.includes('what can you do') || message.includes('assist') ||
        message.includes('support')) {
      return "🤖 I can help you with:\n\n" +
             "💰 Earning FP — Multiple ways to earn\n" +
             "🔗 Wallet Connection — Hiro, Xverse, Leather\n" +
             "🏆 Leaderboard — Rankings and rewards\n" +
             "♟️ Game Rules — Chess guidelines and strategies\n" +
             "🎯 Tournaments — Events and competitions\n" +
             "📊 Rating System — Skill levels and progression\n" +
             "🛡️ Security — Platform safety and trust\n" +
             "💰 Conversion — FP to STX tokens\n" +
             "📱 Mobile — Playing on different devices\n\n" +
             "Just ask me about any of these topics!";
    } 
    
    // Default response for unrecognized messages
    return "At the moment, I'm specifically trained to help with Bitflix gaming platform topics! 🎮\n\n" +
           "I can provide detailed information about:\n" +
           "• Earning FP through chess and tournaments\n" +
           "• Connecting your Stacks wallet (Hiro, Xverse, Leather)\n" +
           "• Understanding the leaderboard and rating system\n" +
           "• Chess strategies and game improvements\n" +
           "• Tournament schedules and prize pools\n" +
           "• Converting FP to STX tokens\n\n" +
           "Which of these Bitflix topics would you like to explore? I'm here to make your gaming experience amazing! 💫";
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 backdrop-blur-sm">
      <div className="bg-[#1a1d29] rounded-2xl w-[90%] max-w-md h-[80%] flex flex-col shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <div>
              <h3 className="text-white font-bold">Bitflix AI Assistant</h3>
              <p className="text-gray-400 text-sm">Online • Ready to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-all"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                    : 'bg-gray-800 text-gray-100'
                }`}
              >
                <p className="whitespace-pre-line text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.isUser ? 'text-cyan-100' : 'text-gray-400'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-100 p-3 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about FP earnings, wallets, chess strategies..."
              className="flex-1 bg-gray-800 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-cyan-500 transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitflixChatbot;