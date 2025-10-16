import { useState, useEffect } from 'react';
import { showConnect } from '@stacks/connect';

interface UserData {
  profile?: {
    stxAddress?: {
      testnet?: string;
      mainnet?: string;
    };
  };
}

export const useStacks = () => {
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if user was previously connected
    const checkPreviousSession = () => {
      const savedUserData = localStorage.getItem('stacks-user-data');
      if (savedUserData) {
        try {
          const parsedData = JSON.parse(savedUserData);
          setUserData(parsedData);
          setIsConnected(true);
          
          const addr = parsedData?.profile?.stxAddress?.testnet || parsedData?.profile?.stxAddress?.mainnet || '';
          setAddress(addr);
        } catch (error) {
          console.error('Error loading saved session:', error);
        }
      }
    };

    checkPreviousSession();
  }, []);

  const connectWallet = async (manualAddress?: string) => {
    console.log('🔄 connectWallet called with:', manualAddress);
    
    return new Promise((resolve, reject) => {
      try {
        setIsConnecting(true);

        // If manual address is provided, use it directly (SIMULATED CONNECTION)
        if (manualAddress) {
          console.log('🔗 Using manual address connection:', manualAddress);
          
          // Simulate API call/connection delay
          setTimeout(() => {
            setAddress(manualAddress);
            setIsConnected(true);
            setIsConnecting(false);
            
            // Create mock user data for manual connection
            const mockUserData = {
              profile: {
                stxAddress: {
                  testnet: manualAddress.startsWith('ST') ? manualAddress : undefined,
                  mainnet: manualAddress.startsWith('SP') ? manualAddress : undefined,
                }
              }
            };
            
            setUserData(mockUserData);
            localStorage.setItem('stacks-user-data', JSON.stringify(mockUserData));
            
            console.log('✅ Manual wallet connected:', manualAddress);
            resolve(mockUserData);
          }, 1500); // 1.5 second delay to simulate connection
          
          return;
        }

        // Otherwise use Hiro Wallet connection
        console.log('🔗 Using Hiro Wallet connection');
        showConnect({
          appDetails: {
            name: 'BITFLIX',
            icon: window.location.origin + import.meta.env.BASE_URL + 'image1.png',
          },
          onFinish: (data: any) => {
            setIsConnecting(false);
            const userData = data.userSession.loadUserData();
            setUserData(userData);
            setIsConnected(true);
            
            const addr = userData?.profile?.stxAddress?.testnet || userData?.profile?.stxAddress?.mainnet || '';
            setAddress(addr);
            
            // Save to localStorage for persistence
            localStorage.setItem('stacks-user-data', JSON.stringify(userData));
            console.log('✅ Hiro Wallet connected:', addr);
            resolve(userData);
          },
          onCancel: () => {
            setIsConnecting(false);
            console.log('❌ Wallet connection cancelled');
            reject(new Error('Connection cancelled by user'));
          },
        });
      } catch (error) {
        setIsConnecting(false);
        console.error('❌ Connection error:', error);
        reject(error);
      }
    });
  };

  const disconnectWallet = () => {
    setUserData(null);
    setIsConnected(false);
    setAddress('');
    setIsConnecting(false);
    localStorage.removeItem('stacks-user-data');
  };

  return {
    userData,
    isConnected,
    connectWallet,
    disconnectWallet,
    mounted,
    address,
    isConnecting,
  };
};