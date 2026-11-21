import React from 'react';
import { Home, Trophy, Activity, Vote, User } from 'lucide-react';
import { TabBar } from 'glisse';
import type { NavTab } from '../types';
import { triggerHaptic } from '../utils/telegram';

interface NavigationProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

const TAB_ITEMS = [
  { value: 'home', label: 'Home', icon: <Home /> },
  { value: 'officials', label: 'Index', icon: <Trophy /> },
  { value: 'forum', label: 'Voice', icon: <Activity /> },
  { value: 'elections', label: 'Polls', icon: <Vote /> },
  { value: 'profile', label: 'Profile', icon: <User /> },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onChangeTab }) => {
  return (
    <div className="lg:hidden fixed bottom-2.5 inset-x-0 z-30 flex justify-center px-3 pointer-events-none safe-bottom">
      <div className="pointer-events-auto">
        <TabBar
          aria-label="Mobile navigation"
          items={TAB_ITEMS}
          value={activeTab}
          onValueChange={(value) => {
            triggerHaptic('selection');
            onChangeTab(value as NavTab);
          }}
        />
      </div>
    </div>
  );
};
