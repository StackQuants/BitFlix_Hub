
import React from 'react';
import { Tab } from '../types';
import HomeIcon from './icons/HomeIcon';
import RankingsIcon from './icons/RankingsIcon';
import ProfileIcon from './icons/ProfileIcon';
import WalletIcon from './icons/WalletIcon';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavItem: React.FC<{
  label: Tab;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClass = isActive ? 'text-amber-400' : 'text-gray-400';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-1/4 transition-colors duration-200 ${activeClass} hover:text-amber-300`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { label: Tab.Home, icon: <HomeIcon /> },
    { label: Tab.Rankings, icon: <RankingsIcon /> },
    { label: Tab.Profile, icon: <ProfileIcon /> },
    { label: Tab.Wallet, icon: <WalletIcon /> },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#1a1d29] border-t border-gray-700/50 flex items-center justify-around z-10 rounded-b-3xl">
      {navItems.map((item) => (
        <NavItem
          key={item.label}
          label={item.label}
          icon={item.icon}
          isActive={activeTab === item.label}
          onClick={() => setActiveTab(item.label)}
        />
      ))}
    </div>
  );
};

export default BottomNav;
