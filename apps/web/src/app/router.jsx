import React, { useState } from 'react';
import { StartPage } from '../features/start/pages/StartPage.jsx';
import { TodayPage } from '../features/routine/pages/TodayPage.jsx';

export function AppRouter() {
  const [currentPage, setCurrentPage] = useState('start');
  const [activeContext, setActiveContext] = useState(null);

  const handleStartPlan = (context) => {
    setActiveContext(context);
    setCurrentPage('today');
  };

  const handleBackToStart = () => {
    setCurrentPage('start');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {currentPage === 'start' && <StartPage onStartPlan={handleStartPlan} />}
      {currentPage === 'today' && (
        <TodayPage initialContext={activeContext} onBackToStart={handleBackToStart} />
      )}
    </main>
  );
}
