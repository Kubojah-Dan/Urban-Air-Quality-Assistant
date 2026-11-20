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

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {currentPage === 'start' && <StartPage onStartPlan={handleStartPlan} />}
      {currentPage === 'today' && <TodayPage initialContext={activeContext} />}
    </main>
  );
}
