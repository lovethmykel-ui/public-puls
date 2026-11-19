import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NavTab, Official, Agency } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeView } from './components/HomeView';
import { MarketsView } from './components/MarketsView';
import { OfficialsView } from './components/OfficialsView';
import { ElectionsView } from './components/ElectionsView';
import { ProfileView } from './components/ProfileView';
import { PoliticianModal } from './components/PoliticianModal';
import { AgencyModal } from './components/AgencyModal';
import { VerificationModal } from './components/VerificationModal';
import { RateModal } from './components/RateModal';
import { DeviceFrame } from './components/DeviceFrame';
import { initTelegramApp } from './utils/telegram';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedOfficial, setSelectedOfficial] = useState<Official | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [rateTarget, setRateTarget] = useState<{
    name: string;
    role: string;
    type: 'official' | 'agency';
  } | null>(null);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    initTelegramApp();
  }, []);

  const handleRateOfficial = (official: Official) => {
    setSelectedOfficial(null);
    setRateTarget({
      name: official.name,
      role: official.role,
      type: 'official',
    });
  };

  const handleRateAgency = (agency: Agency) => {
    setSelectedAgency(null);
    setRateTarget({
      name: agency.name,
      role: agency.headTitle,
      type: 'agency',
    });
  };

  return (
    <DeviceFrame>
      <div className="flex-1 flex flex-col relative w-full overflow-x-hidden min-h-full">
        {/* Top App Header */}
        <Header
          userName="Amara"
          isVerified={isVerified}
          onOpenVerification={() => setIsVerificationOpen(true)}
          onOpenNotifications={() => {}}
        />

        {/* Tab View Content Container with Spring Transitions */}
        <main className="flex-1 w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeTab === 'home' && (
                <HomeView
                  onSelectOfficial={(official) => setSelectedOfficial(official)}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenVerification={() => setIsVerificationOpen(true)}
                />
              )}

              {activeTab === 'markets' && (
                <MarketsView
                  onSelectOfficial={(official) => setSelectedOfficial(official)}
                  onSelectAgency={(agency) => setSelectedAgency(agency)}
                />
              )}

              {activeTab === 'officials' && (
                <OfficialsView
                  onSelectOfficial={(official) => setSelectedOfficial(official)}
                  onSelectAgency={(agency) => setSelectedAgency(agency)}
                  onOpenRateModal={(target) => setRateTarget(target)}
                />
              )}

              {activeTab === 'elections' && <ElectionsView />}

              {activeTab === 'profile' && (
                <ProfileView onOpenVerification={() => setIsVerificationOpen(true)} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Floating Apple-grade Bottom Navigation */}
        <Navigation
          activeTab={activeTab}
          onChangeTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Modals & Bottom Sheets */}
        <PoliticianModal
          official={selectedOfficial}
          onClose={() => setSelectedOfficial(null)}
          onRate={handleRateOfficial}
        />

        <AgencyModal
          agency={selectedAgency}
          onClose={() => setSelectedAgency(null)}
          onRate={handleRateAgency}
        />

        <VerificationModal
          isOpen={isVerificationOpen}
          onClose={() => setIsVerificationOpen(false)}
          onComplete={() => setIsVerified(true)}
        />

        <RateModal
          isOpen={rateTarget !== null}
          target={rateTarget}
          onClose={() => setRateTarget(null)}
          onSubmitRating={() => {}}
        />
      </div>
    </DeviceFrame>
  );
};

export default App;
