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
      text: "Hi! I'm Bitflix AI Assistant. I can help you with earning money, wallet connections, leaderboard info, and game guidelines. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Your new OpenAI API key
  const OPENAI_API_KEY = "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";

  // Check if question is common/predefined
  const isCommonQuestion = (message: string): boolean => {
    const commonKeywords = [
      // Greetings
      'hello', 'hi', 'hey', 'greetings', 'howdy',
      // Basic questions
      'earn', 'money', 'btc', 'bitcoin', 'wallet', 'connect',
      'leaderboard', 'ranking', 'top', 'game', 'chess', 'rules',
      'how to play', 'tournament', 'upcoming', 'rating', 'skill',
      'level', 'help', 'what can you do', 'thank', 'thanks',
      'who are you', 'how are you', 'bye', 'goodbye'
    ];
    
    const messageLower = message.toLowerCase();
    return commonKeywords.some(keyword => messageLower.includes(keyword));
  };

  // Hand-coded responses for common questions
  const getCommonResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "👋 Hello there! Welcome to Bitflix!\n\nI'm your AI assistant here to help you with earning BTC, connecting your wallet, understanding our leaderboard, chess strategies, tournaments, and rating system. What would you like to know?";
    }
    
    // How are you
    if (message.includes('how are you') || message.includes("how's it going")) {
      return "I'm doing great! Ready to help you navigate Bitflix and maximize your earnings. 😊\n\nWhat can I assist you with today?";
    }
    
    // Thanks
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're very welcome! 😊\n\nIs there anything else you'd like to know about Bitflix?";
    }
    
    // Who are you
    if (message.includes('who are you') || message.includes('what are you')) {
      return "I'm the Bitflix AI Assistant! 🤖\n\nI'm here to help you succeed on our gaming platform - from earning BTC to mastering chess strategies!";
    }
    
    // Goodbye
    if (message.includes('bye') || message.includes('goodbye')) {
      return "👋 Goodbye! It was great chatting with you!\n\nGood luck with your games and earnings! 🎯";
    }
    
    // Earning money
    if (message.includes('earn') || message.includes('money') || message.includes('btc') || message.includes('bitcoin')) {
      return "💰 **Ways to Earn BTC on Bitflix:**\n\n" +
             "• **Win Chess Games** - Earn BTC by defeating opponents\n" +
             "• **Tournament Prizes** - Compete for bigger rewards\n" +
             "• **Daily Challenges** - Complete tasks for bonus BTC\n" +
             "• **Referral Program** - Earn 10% of friends' winnings\n" +
             "• **Leaderboard Rewards** - Weekly BTC bonuses for top players\n" +
             "• **Achievement Bonuses** - Unlock extra rewards\n\n" +
             "Start with low-stakes games to build your skills!";
    }
    
    // Wallet connection
    if (message.includes('wallet') || message.includes('connect')) {
      return "🔗 **Wallet Connection:**\n\n" +
             "**Supported Wallets:** MetaMask, Trust Wallet, Coinbase Wallet, Ledger, Trezor\n\n" +
             "**How to Connect:**\n" +
             "1. Click 'Connect Wallet'\n" +
             "2. Select your wallet\n" +
             "3. Approve connection\n" +
             "4. Start earning BTC!\n\n" +
             "Your private keys stay secure in your wallet.";
    }
    
    // Leaderboard
    if (message.includes('leaderboard') || message.includes('ranking')) {
      return "🏆 **Leaderboard:**\n\n" +
             "**Weekly BTC Bonuses:**\n" +
             "• #1: 0.1 BTC\n" +
             "• Top 3: 0.05 BTC\n" +
             "• Top 5: 0.02 BTC\n" +
             "• Top 10: 0.01 BTC\n\n" +
             "Rankings based on chess rating, win rate, and total earnings!";
    }
    
    // Game rules
    if (message.includes('game') || message.includes('chess') || message.includes('rules') || message.includes('how to play')) {
      return "♟️ **Chess Guidelines:**\n\n" +
             "**Time Controls:**\n" +
             "• 5min (Blitz)\n" +
             "• 10min (Rapid)\n" +
             "• 15min (Standard)\n" +
             "• 20min (Classic)\n\n" +
             "**Beginner Tips:**\n" +
             "• Control the center\n" +
             "• Develop pieces early\n" +
             "• Castle for king safety\n" +
             "• Watch your time!";
    }
    
    // Tournaments
    if (message.includes('tournament') || message.includes('upcoming')) {
      return "🏆 **Tournaments:**\n\n" +
             "**Live:** Chess Championship (0.005 BTC entry)\n" +
             "**Coming Soon:** Poker, Trivia, Racing\n\n" +
             "Prize pools up to 1 BTC!";
    }
    
    // Rating system
    if (message.includes('rating') || message.includes('skill') || message.includes('level')) {
      return "📊 **Rating System:**\n\n" +
             "• 1200-1400: Beginner\n" +
             "• 1400-1600: Novice\n" +
             "• 1600-1800: Intermediate\n" +
             "• 1800-2000: Advanced\n" +
             "• 2000-2200: Expert\n" +
             "• 2200+: Master\n\n" +
             "Start at 1200 and climb the ranks!";
    }
    
    // General help
    if (message.includes('help') || message.includes('what can you do')) {
      return "🤖 **I can help with:**\n\n" +
             "💰 Earning BTC\n" +
             "🔗 Wallet connections\n" +
             "🏆 Leaderboard & rankings\n" +
             "♟️ Chess strategies\n" +
             "🏆 Tournaments\n" +
             "📊 Rating system\n\n" +
             "Ask me anything about Bitflix!";
    }
    
    // If it's a common question but we don't have a specific response
    return "I'd be happy to help you with Bitflix! Could you be more specific about what you'd like to know?";
  };

  // AI response for unusual/complex questions
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const prompt = `You are a helpful AI assistant for Bitflix - a gaming platform where users can earn Bitcoin by playing games.

BITFLIX PLATFORM DETAILS:
- Platform: Bitflix (gaming platform)
- Main Game: Chess with Bitcoin rewards
- Earnings: Users earn BTC by winning chess games and tournaments
- Wallets: MetaMask, Trust Wallet, Coinbase Wallet, Ledger, Trezor
- Leaderboard: Weekly BTC rewards for top players (#1: 0.1 BTC, Top 3: 0.05 BTC, etc.)
- Tournaments: Chess championships with prize pools up to 1 BTC
- Rating System: 1200-2400+ (Beginner to Master)
- Time Controls: 5min (Blitz), 10min (Rapid), 15min (Standard), 20min (Classic)
- Additional Games: Poker, Trivia, Racing (coming soon)
- Referral Program: Earn 10% of friends' winnings
- Security: Non-custodial, private keys never leave user's wallet

USER QUESTION: "${userMessage}"

Provide a helpful, friendly response focused specifically on Bitflix gaming platform. If the question is about general topics unrelated to Bitflix, gently steer the conversation back to Bitflix gaming and earning BTC. Keep responses concise but informative.`;

      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo-instruct",
          prompt: prompt,
          temperature: 0.7,
          max_tokens: 400,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].text.trim();

    } catch (error) {
      console.error('OpenAI API error:', error);
      return "I'm having trouble connecting right now. Please try again shortly, or ask me about earning BTC, wallet connections, chess strategies, or Bitflix tournaments!";
    }
  };

  const getResponse = async (userMessage: string): Promise<string> => {
    // Use hand-coded responses for common questions
    if (isCommonQuestion(userMessage)) {
      return getCommonResponse(userMessage);
    }
    
    // Use AI for unusual/complex questions
    return await getAIResponse(userMessage);
  };

  const handleSendMessage = async () => {
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

    try {
      const response = await getResponse(inputText);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble responding right now. Please try again!",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
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
              <p className="text-gray-400 text-sm">Online • Smart Responses</p>
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
              placeholder="Ask me anything about Bitflix..."
              className="flex-1 bg-gray-800 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600 focus:outline-none focus:border-cyan-500 transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
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