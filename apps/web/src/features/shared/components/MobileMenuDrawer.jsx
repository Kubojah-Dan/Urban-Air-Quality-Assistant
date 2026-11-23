import React from 'react';
import {
  X,
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  Bell,
  ShieldCheck,
  Calendar,
  Home,
  Wind,
  Compass,
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';

/**
 * MobileMenuDrawer
 *
 * Glassmorphic slide-out sidebar for mobile viewports.
 * Houses user authentication, theme switcher, notifications, settings, and navigation.
 * Prevents mobile header crowding and eliminates overlap on small screens.
 */
export function MobileMenuDrawer({
  isOpen,
  onClose,
  activeTab,
  onChangeTab,
  theme,
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenPrivacy,
  selectedCity = 'Delhi, India'
}) {
  if (!isOpen) return null;

  const navItems = [
    { id: 'landing', label: 'Overview', icon: Sparkles },
    { id: 'today', label: 'Today Dashboard', icon: Home },
    { id: 'routine', label: 'My Routine Planner', icon: Calendar },
    { id: 'indoor', label: 'Indoor Air Coach', icon: Wind },
    { id: 'explorer', label: 'Air Quality Explorer', icon: Compass },
    { id: 'history', label: 'Impact History', icon: FileText },
    { id: 'assistant', label: 'AI Assistant', icon: Sparkles }
  ];

  const handleNavClick = (tabId) => {
    onChangeTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Chassis */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className="fixed right-0 top-0 bottom-0 w-[82%] max-w-sm bg-white/95 dark:bg-[#0c1427]/95 backdrop-blur-2xl border-l border-slate-200 dark:border-white/15 shadow-2xl p-5 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        <div className="space-y-5">
          {/* Top Bar: Brand + Close */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <img src="/dayshift-logo.svg" alt="DayShift Logo" className="h-7 w-auto" />
              <span className="text-base font-black tracking-tight font-display text-slate-900 dark:text-white">
                Day<span className="text-cyber-teal">Shift</span>
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="p-2 rounded-xl text-slate-600 dark:text-cyber-text-secondary hover:bg-slate-100 dark:hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile / Sign In Card */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            {currentUser ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      className="w-10 h-10 rounded-full object-cover border border-cyber-teal/40"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-cyber-teal text-slate-950 font-black flex items-center justify-center font-display text-sm shadow-cyber-glow-teal">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate font-display">
                      {currentUser.displayName || 'DayShift User'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-cyber-text-secondary truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPrivacy && onOpenPrivacy();
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSignOut();
                    }}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-center">
                <div className="w-9 h-9 rounded-full bg-cyber-teal/20 text-cyber-teal mx-auto flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
                    Account & Personalization
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-cyber-text-secondary mt-0.5">
                    Save your custom daily routines and sync preferences.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="w-full py-2 rounded-xl bg-cyber-teal text-slate-950 font-black text-xs shadow-cyber-glow-teal hover:opacity-95 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Theme Toggle Row */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Appearance Theme
            </span>
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-1.5 py-1 px-3 rounded-xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-xs font-bold cursor-pointer text-slate-900 dark:text-white shadow-2xs"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-cyber-amber" />
                  <span>Dark Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyber-blue" />
                  <span>Light Mode</span>
                </>
              )}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-cyber-text-muted px-2 block">
              Navigation
            </span>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-cyber-teal text-slate-950 font-extrabold shadow-cyber-glow-teal'
                        : 'text-slate-700 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Disclosures */}
        <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-1 text-[10px] text-slate-500 dark:text-cyber-text-muted">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyber-teal" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
          <p>Active City: {selectedCity.split(',')[0]} • CAMS & CPCB Ingestion</p>
        </div>
      </div>
    </div>
  );
}
