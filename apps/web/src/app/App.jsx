import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { AppProviders } from './providers.jsx';
import { AssistantProvider } from '../features/assistant/context/AssistantContext.jsx';
import { DayShiftAiOrb } from '../features/assistant/components/DayShiftAiOrb.jsx';
import { GlobalAiChatDrawer } from '../features/assistant/components/GlobalAiChatDrawer.jsx';
import { TopBar } from '../features/shared/components/TopBar.jsx';
import { BottomNav } from '../features/shared/components/BottomNav.jsx';
import { Footer } from '../features/shared/components/Footer.jsx';
import { AuthModal } from '../features/auth/components/AuthModal.jsx';
import { authService } from '../infrastructure/auth/firebaseAuth.js';
import { AppRouter } from './router.jsx';
import { ShieldCheck, AlertCircle, Clock, X } from 'lucide-react';
import '../styles/globals.css';
import '../styles/tokens.css';

const VALID_PAGES = ['landing', 'today', 'routine', 'indoor', 'explorer', 'impact', 'assistant', 'privacy', 'onboarding'];

function getPageFromUrl() {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.replace(/^\/+/, '').split('/')[0].toLowerCase();
  return VALID_PAGES.includes(path) ? path : 'landing';
}

export function App() {
  const [currentPage, setCurrentPageRaw] = useState(getPageFromUrl);

  const setCurrentPage = (newPage) => {
    setCurrentPageRaw(newPage);
    if (typeof window !== 'undefined') {
      const targetPath = newPage === 'landing' ? '/' : `/${newPage}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page: newPage }, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPageRaw(getPageFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('dayshift_theme') || 'dark';
    } catch {
      return 'dark';
    }
  }); // 'dark' | 'light' (default dark cyberpunk)
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState(null);
  const [pendingTargetPage, setPendingTargetPage] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());
  const [sessionTimeoutNotice, setSessionTimeoutNotice] = useState(false);

  const [activeContext, setActiveContext] = useState({
    task: 'commute',
    city: {
      countryCode: 'IN',
      cityId: 'delhi',
      displayName: 'Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      timeZone: 'Asia/Kolkata'
    },
    initialContext: {
      departureTime: '08:00',
      deadlineTime: '09:00',
      transitFeasible: true,
      hasVentedHood: true,
      commuteMode: 'car_petrol'
    }
  });

  // Apply theme class to document body & html element
  useEffect(() => {
    try {
      localStorage.setItem('dayshift_theme', theme);
    } catch {}

    if (theme === 'light') {
      document.body.classList.add('theme-light');
      document.documentElement.classList.remove('dark');
    } else {
      document.body.classList.remove('theme-light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // 15-Minute Inactivity Auto-Logout for Security & DPDP Compliance
  useEffect(() => {
    if (!currentUser) return;

    let timer;
    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

    const resetInactivityTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        await authService.signOut();
        setCurrentUser(null);
        setSessionTimeoutNotice(true);
        // If on onboarding or private settings, safely return to landing
        setCurrentPage((prev) => (prev === 'onboarding' || prev === 'privacy' ? 'landing' : prev));
      }, INACTIVITY_TIMEOUT_MS);
    };

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetInactivityTimer, { passive: true }));
    resetInactivityTimer();

    return () => {
      clearTimeout(timer);
      activityEvents.forEach((ev) => window.removeEventListener(ev, resetInactivityTimer));
    };
  }, [currentUser]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleRequireAuth = (targetPage, customPrompt) => {
    setPendingTargetPage(targetPage);
    setAuthPromptMessage(customPrompt || 'Please sign in or create an account to personalize and save your daily routine.');
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    if (pendingTargetPage) {
      setCurrentPage(pendingTargetPage);
      setPendingTargetPage(null);
    }
    setAuthPromptMessage(null);
  };

  return (
    <AppProviders>
      <AssistantProvider>
        <div className="min-h-screen flex flex-col selection:bg-cyber-teal selection:text-slate-950 pb-20 md:pb-6 transition-colors duration-300 relative">
          {/* Inactivity Session Timeout Toast */}
          {sessionTimeoutNotice && (
            <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold flex items-center justify-between shadow-lg sticky top-0 z-50 animate-in fade-in">
              <div className="flex items-center gap-2 max-w-7xl mx-auto flex-1">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Security notice: You were automatically logged out after 15 minutes of inactivity.</span>
              </div>
              <button
                type="button"
                onClick={() => setSessionTimeoutNotice(false)}
                className="p-1 hover:bg-black/10 rounded-lg cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Futuristic TopBar */}
          <TopBar
            activeTab={currentPage}
            onChangeTab={setCurrentPage}
            selectedCity={activeContext?.city?.displayName || 'Delhi, India'}
            selectedCityObject={activeContext?.city}
            onSelectCity={(city) => {
              setActiveContext((prev) => ({
                ...prev,
                city
              }));
            }}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            currentUser={currentUser}
            onOpenAuth={() => {
              setAuthPromptMessage(null);
              setIsAuthOpen(true);
            }}
            onSignOut={handleSignOut}
            onOpenPrivacy={() => setCurrentPage('privacy')}
          />

          {/* Dynamic Screen View */}
          <div className="flex-1">
            <AppRouter
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              activeContext={activeContext}
              setActiveContext={setActiveContext}
              currentUser={currentUser}
              onRequireAuth={handleRequireAuth}
            />
          </div>

          {/* Global Floating DayShift AI Orb Launcher (Feature Eleven) */}
          <DayShiftAiOrb />

          {/* Global Floating DayShift AI Assistant Panel (Feature Eleven & Eight) */}
          <GlobalAiChatDrawer
            currentPage={currentPage}
            activeContext={activeContext}
          />

          {/* Global Footer with Scientific Citations & Logo (Overview / Landing page only) */}
          {currentPage === 'landing' && <Footer onChangeTab={setCurrentPage} />}

          {/* Floating Mobile Bottom Navigation */}
          <BottomNav
            activeTab={currentPage}
            onChangeTab={setCurrentPage}
          />

          {/* Firebase Authentication Modal */}
          <AuthModal
            isOpen={isAuthOpen}
            promptMessage={authPromptMessage}
            onClose={() => {
              setIsAuthOpen(false);
              setAuthPromptMessage(null);
              setPendingTargetPage(null);
            }}
            onAuthSuccess={handleAuthSuccess}
          />
        </div>
      </AssistantProvider>
    </AppProviders>
  );
}

// Mount in browser environment
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export default App;
