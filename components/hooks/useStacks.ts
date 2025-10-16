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
  const [balance, setBalance] = useState<number>(0); // ✅ balance state

  useEffect(() => {
    setMounted(true);
    const savedUserData = localStorage.getItem('stacks-user-data');
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData);
        setUserData(parsedData);
        setIsConnected(true);

        const addr =
          parsedData?.profile?.stxAddress?.testnet ||
          parsedData?.profile?.stxAddress?.mainnet ||
          '';
        setAddress(addr);

        if (addr) fetchBalance(addr);
      } catch (error) {
        console.error('Error loading saved session:', error);
      }
    }
  }, []);

  // ✅ Fetch STX balance from Hiro API
  const fetchBalance = async (addr: string) => {
    try {
      const res = await fetch(`https://api.hiro.so/v2/accounts/${addr}`);
      const data = await res.json();
      const microStx = parseInt(data.balance || '0');
      const stxBalance = microStx / 1_000_000; // convert microstacks → STX
      setBalance(stxBalance);
      console.log(`💰 [Fetched balance]: ${stxBalance} STX`);
      return stxBalance;
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setBalance(0);
      return 0;
    }
  };

  // ✅ Wallet connection (manual or Hiro)
  const connectWallet = async (manualAddress?: string) => {
    console.log('🔄 connectWallet called with:', manualAddress);

    return new Promise((resolve, reject) => {
      try {
        setIsConnecting(true);

        // Simulated/manual wallet
        if (manualAddress) {
          console.log('🔗 Using manual address connection:', manualAddress);
          setTimeout(async () => {
            setAddress(manualAddress);
            setIsConnected(true);
            setIsConnecting(false);

            const mockUserData = {
              profile: {
                stxAddress: {
                  testnet: manualAddress.startsWith('ST')
                    ? manualAddress
                    : undefined,
                  mainnet: manualAddress.startsWith('SP')
                    ? manualAddress
                    : undefined,
                },
              },
            };

            setUserData(mockUserData);
            localStorage.setItem(
              'stacks-user-data',
              JSON.stringify(mockUserData)
            );

            await fetchBalance(manualAddress);
            console.log('✅ Manual wallet connected:', manualAddress);
            resolve(mockUserData);
          }, 1500);
          return;
        }

        // Hiro Wallet flow
        console.log('🔗 Using Hiro Wallet connection');
        showConnect({
          appDetails: {
            name: 'BITFLIX',
          },
          onFinish: async (data: any) => {
            setIsConnecting(false);
            const userData = data.userSession.loadUserData();
            setUserData(userData);
            setIsConnected(true);

            const addr =
              userData?.profile?.stxAddress?.testnet ||
              userData?.profile?.stxAddress?.mainnet ||
              '';
            setAddress(addr);

            localStorage.setItem('stacks-user-data', JSON.stringify(userData));
            await fetchBalance(addr);

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
    setBalance(0);
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
    balance, // ✅ expose live balance
    fetchBalance, // ✅ allow manual refresh
  };
};
