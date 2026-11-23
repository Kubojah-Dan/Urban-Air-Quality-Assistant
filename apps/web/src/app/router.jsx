import React, { useState } from 'react';
import { LandingPage } from '../features/landing/pages/LandingPage.jsx';
import { OnboardingFlow } from '../features/onboarding/pages/OnboardingFlow.jsx';
import { TodayPage } from '../features/routine/pages/TodayPage.jsx';
import { RoutinePage } from '../features/routine/pages/RoutinePage.jsx';
import { IndoorPage } from '../features/indoor/pages/IndoorPage.jsx';
import { ExplorerPage } from '../features/explorer/pages/ExplorerPage.jsx';
import { ImpactHistoryPage } from '../features/impact/pages/ImpactHistoryPage.jsx';
import { AssistantPage } from '../features/assistant/pages/AssistantPage.jsx';
import { PrivacySettingsPage } from '../features/preferences/pages/PrivacySettingsPage.jsx';
import { StartPage } from '../features/start/pages/StartPage.jsx';

export function AppRouter({
  currentPage: externalPage,
  setCurrentPage: setExternalPage,
  activeContext,
  setActiveContext,
  currentUser,
  onRequireAuth
}) {
  const [internalPage, setInternalPage] = useState('landing');
  const [internalContext, setInternalContext] = useState(null);
  const [previousPage, setPreviousPage] = useState('landing');

  const currentPage = externalPage || internalPage;
  const setCurrentPage = setExternalPage || setInternalPage;
  const context = activeContext !== undefined ? activeContext : internalContext;
  const setContext = setActiveContext || setInternalContext;

  const handleStartOnboarding = () => {
    // If user is not authenticated, prompt sign in / registration first
    if (!currentUser && onRequireAuth) {
      onRequireAuth('onboarding', 'Please sign in or create an account to personalize and save your daily routine.');
      return;
    }
    setPreviousPage(currentPage);
    setCurrentPage('onboarding');
  };

  const handleCompleteOnboarding = (newContext) => {
    setContext(newContext);
    setPreviousPage('onboarding');
    setCurrentPage('today');
  };

  const handleStartPlan = (newContext) => {
    setContext(newContext);
    setPreviousPage('start');
    setCurrentPage('today');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleBackFromPrivacy = () => {
    setCurrentPage(previousPage || 'today');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
      {/* Screen A: Landing Page */}
      {currentPage === 'landing' && (
        <LandingPage
          onStartOnboarding={handleStartOnboarding}
          onExploreAirQuality={() => setCurrentPage('explorer')}
        />
      )}

      {/* Screen B: Progressive Onboarding */}
      {currentPage === 'onboarding' && (
        <OnboardingFlow
          onComplete={handleCompleteOnboarding}
          onCancel={handleBackToLanding}
        />
      )}

      {/* Legacy Start Page (backward compatible) */}
      {currentPage === 'start' && <StartPage onStartPlan={handleStartPlan} />}

      {/* Screen C: Today Dashboard (The Hero Board) */}
      {currentPage === 'today' && (
        <TodayPage
          initialContext={context}
          onBackToStart={handleBackToLanding}
        />
      )}

      {/* Screen D: My Routine */}
      {currentPage === 'routine' && (
        <RoutinePage
          initialContext={context}
          onSwitchToToday={() => setCurrentPage('today')}
        />
      )}

      {/* Screen F: Indoor Air Coach */}
      {currentPage === 'indoor' && <IndoorPage initialContext={context} />}

      {/* Screen H: Air Quality Explorer */}
      {currentPage === 'explorer' && (
        <ExplorerPage
          initialCity={context?.city}
          onSelectCity={(city) => {
            setContext((prev) => ({
              ...prev,
              city
            }));
          }}
        />
      )}

      {/* Screen I: Impact History */}
      {currentPage === 'history' && <ImpactHistoryPage />}

      {/* Screen G: Environmental AI Assistant */}
      {currentPage === 'assistant' && (
        <AssistantPage initialContext={context} />
      )}

      {/* Screen J: Privacy Settings */}
      {currentPage === 'privacy' && (
        <PrivacySettingsPage onBack={handleBackFromPrivacy} />
      )}
    </main>
  );
}
