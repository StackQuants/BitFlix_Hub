import React, { useState } from 'react';

interface EntryScreenProps {
  onLogin: (address: string, name: string) => void;
}

const EntryScreen: React.FC<EntryScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const validateName = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue.length < 4) {
      setNameError('Name must be at least 4 characters');
      return false;
    }
    if (trimmedValue.length > 16) {
      setNameError('Name must not exceed 16 characters');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedValue)) {
      setNameError('Name can only contain letters, numbers, and underscores');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.trim()) {
      validateName(value.trim());
    } else {
      setNameError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      connectLeatherWallet();
    }
  };

  const connectLeatherWallet = async () => {
    // Validate name before proceeding
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError('Please enter your name');
      return;
    }
    
    if (!validateName(trimmedName)) {
      return;
    }

    try {
      setIsConnecting(true);
      
      // Check if Leather wallet is installed
      if (typeof window !== 'undefined' && (window as any).LeatherProvider) {
        const leather = (window as any).LeatherProvider;
        
        // Request account access
        const response = await leather.request('getAddresses');
        
        console.log('🔍 Full wallet response:', response);
        
        if (response.result && response.result.addresses) {
          // Look for Stacks addresses specifically (they start with SP or ST)
          const stacksAddress = response.result.addresses.find((addr: any) => 
            addr.address && (addr.address.startsWith('SP') || addr.address.startsWith('ST'))
          );
          
          if (stacksAddress) {
            const address = stacksAddress.address;
            console.log('✅ Connected to Stacks wallet:', address);
            
            // Store the name along with the wallet connection
            const userData = {
              name: trimmedName,
              address: address,
              timestamp: Date.now()
            };
            
            // Store in localStorage as backup
            localStorage.setItem('bitflix_user', JSON.stringify(userData));
            
            // ✅ UPDATED: Pass both address and name to onLogin
            onLogin(address, trimmedName);
            
            alert(`Welcome ${trimmedName}! Stacks wallet connected successfully!`);
          } else {
            // If no Stacks address found, show what addresses we got
            console.log('❌ No Stacks address found. Available addresses:', response.result.addresses);
            const addressTypes = response.result.addresses.map((addr: any) => 
              `${addr.address.substring(0, 10)}... (${addr.address.startsWith('tb1') ? 'BTC' : 'unknown'})`
            ).join(', ');
            
            alert(`No Stacks account found. Your wallet has: ${addressTypes}. Please make sure you have a Stacks account in your Leather wallet.`);
            setIsConnecting(false);
          }
        } else {
          throw new Error('No addresses found in wallet');
        }
      } else {
        // Leather wallet not installed, redirect to installation page
        alert('Leather wallet not found. Redirecting to installation page...');
        window.open('https://leather.io/install-extension', '_blank');
        setIsConnecting(false);
      }
    } catch (error) {
      console.error('Error connecting to Leather wallet:', error);
      alert('Failed to connect to Leather wallet. Please try again.');
      setIsConnecting(false);
    }
  };

  const isNameValid = name.trim().length >= 4 && name.trim().length <= 16 && /^[a-zA-Z0-9_]+$/.test(name.trim());

  return (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div 
        className="w-full max-w-sm h-[844px] bg-gradient-to-b from-[#3a2042] via-[#10131c] to-[#1f3a37] text-white overflow-hidden shadow-2xl rounded-3xl relative flex flex-col items-center p-8"
      >
        <div className="flex flex-col items-center justify-around h-full w-full py-8">
          
          {/* Top Section */}
          <div className="text-center">
            <div className="relative w-52 h-52 mx-auto">
              <div className="relative w-full h-full p-1 rounded-full bg-gradient-to-br from-purple-500 via-green-400 to-cyan-400">
                <div className="bg-[#10131c] rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src="/public/image1.png"
                    alt="Person with VR headset"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <h1 className="text-5xl font-extrabold tracking-wider mt-8">
              BIT FLI<span className="text-red-500">X</span>
            </h1>
            <p className="mt-4 font-light text-lg tracking-[0.2em] text-gray-300/80">
              YOUR DECENTRALISED
            </p>
            <p className="font-light text-lg tracking-[0.2em] text-gray-300/80">
              GAMING HUB
            </p>
          </div>

          {/* Bottom Section */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-xs mb-6">
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name (4-16 chars)"
                maxLength={16}
                className="w-full bg-black/30 backdrop-blur-sm border border-gray-700 rounded-full px-6 py-3.5 text-center text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300"
              />
              {nameError && (
                <p className="text-red-400 text-xs text-center mt-2">{nameError}</p>
              )}
              {!nameError && name.trim() && isNameValid && (
                <p className="text-green-400 text-xs text-center mt-2">Name looks good!</p>
              )}
            </div>

            <button
              onClick={connectLeatherWallet}
              disabled={isConnecting || !isNameValid}
              className="w-full max-w-xs p-0.5 rounded-full bg-gradient-to-r from-purple-500 to-orange-500 hover:shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="bg-[#10131c] hover:bg-transparent rounded-full px-6 py-3.5 transition-colors duration-300">
                <span className="font-semibold tracking-widest text-sm uppercase">
                  {isConnecting ? 'Connecting...' : 'Connect Stacks Wallet'}
                </span>
              </div>
            </button>

      

            <div className="flex space-x-3 mt-8">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-white/30"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EntryScreen;