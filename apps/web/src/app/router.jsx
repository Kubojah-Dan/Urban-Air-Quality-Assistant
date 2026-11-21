import React, { useState } from 'react';
import { StartPage } from '../features/start/pages/StartPage.jsx';
import { TodayPage } from '../features/routine/pages/TodayPage.jsx';
import { PrivacySettingsPage } from '../features/preferences/pages/PrivacySettingsPage.jsx';

export function AppRouter({ currentPage: externalPage, setCurrentPage: setExternalPage }) {
  const [internalPage, setInternalPage] = useState('start');
  const [activeContext, setActiveContext] = useState(null);
  const [previousPage, setPreviousPage] = useState('start');

  const currentPage = externalPage || internalPage;
  const setCurrentPage = setExternalPage || setInternalPage;

  const handleStartPlan = (context) => {
    setActiveContext(context);
    setPreviousPage('start');
    setCurrentPage('today');
  };

  const handleBackToStart = () => {
    setCurrentPage('start');
  };

  const handleBackFromPrivacy = () => {
    setCurrentPage(previousPage || 'start');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {currentPage === 'start' && <StartPage onStartPlan={handleStartPlan} />}
      {currentPage === 'today' && (
        <TodayPage initialContext={activeContext} onBackToStart={handleBackToStart} />
      )}
      {currentPage === 'privacy' && <PrivacySettingsPage onBack={handleBackFromPrivacy} />}
    </main>
  );
}
