import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Settings,
  MapPin,
  Compass,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { PlacePicker } from '../../location/components/PlacePicker.jsx';
import { AlertCenter } from '../../alerts/components/AlertCenter.jsx';
import { MobileMenuDrawer } from './MobileMenuDrawer.jsx';
import { authService } from '../../../infrastructure/auth/firebaseAuth.js';

export function TopBar({
  activeTab = 'today',
  onChangeTab,
  selectedCity = 'Delhi, India',
  selectedCityObject,
  onSelectCity,
  theme = 'dark',
  onToggleTheme,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenPrivacy
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navItems = [
    { id: 'landing', label: 'Overview' },
    { id: 'today', label: 'Today' },
    { id: 'routine', label: 'My Routine' },
    { id: 'indoor', label: 'Indoor Air' },
    { id: 'explorer', label: 'Explorer' },
    { id: 'impact', label: 'Impact History' },
    { id: 'assistant', label: 'AI Assistant' }
  ];

  return (
    <>
      <header className="sticky top-2 sm:top-3 z-40 px-3 sm:px-6 transition-all duration-300">
        <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl cyber-card-elevated border border-slate-200/90 dark:border-white/10 px-3 sm:px-5 py-2 sm:py-2.5 backdrop-blur-xl bg-white/90 dark:bg-[#101726]/90 shadow-xl flex items-center justify-between gap-2">
          {/* Brand logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group shrink-0"
            onClick={() => onChangeTab && onChangeTab('landing')}
          >
            <img
              src="/dayshift-logo.svg"
              alt="DayShift Logo"
              className="h-7 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="text-base sm:text-lg font-black tracking-tight font-display text-slate-900 dark:text-white flex items-center select-none">
              Day<span className="text-cyber-teal">Shift</span>
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          {onChangeTab && (
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChangeTab(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal'
                        : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Header Controls (Desktop vs Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Interactive Location Picker Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                aria-label={`Change city, currently ${selectedCity.split(',')[0]}`}
                className="flex items-center gap-1 text-xs text-slate-700 dark:text-cyber-text-secondary bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-2 sm:px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-cyber-teal shrink-0" />
                <span className="font-bold text-slate-900 dark:text-white text-[11px] max-w-[65px] sm:max-w-[130px] truncate">
                  {selectedCity.split(',')[0]}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
              </button>

              {/* City Selection Popover: Center modal on Mobile, Dropdown on Desktop */}
              {showLocationPicker && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-0 sm:bg-transparent sm:backdrop-blur-none sm:absolute sm:inset-auto sm:right-0 sm:mt-2">
                  <div
                    className="fixed inset-0 sm:hidden"
                    onClick={() => setShowLocationPicker(false)}
                    aria-hidden="true"
                  />
                  <div className="relative w-full max-w-sm sm:w-80 p-4 sm:p-3.5 rounded-3xl sm:rounded-2xl cyber-card-elevated shadow-2xl border border-slate-200 dark:border-white/15 space-y-2.5 z-10 bg-white/95 dark:bg-[#101726]/95 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-900 dark:text-white pb-1.5 border-b border-slate-200 dark:border-white/10">
                      <span>Select Monitored Area</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-cyber-teal font-normal font-mono">28 States & UTs</span>
                        <button
                          type="button"
                          onClick={() => setShowLocationPicker(false)}
                          aria-label="Close picker"
                          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white sm:hidden"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <PlacePicker
                      selectedCity={selectedCityObject}
                      compact={true}
                      onSelectCity={(city) => {
                        if (onSelectCity) onSelectCity(city);
                        setShowLocationPicker(false);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Desktop-Only Controls */}
            <div className="hidden sm:flex items-center gap-2">
              {/* Smart Contextual Alerts Bell */}
              <AlertCenter selectedCity={selectedCity} />

              {/* Theme Switcher Toggle (Dark vs Light) */}
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label="Toggle dark/light theme"
                className="p-2 rounded-xl text-slate-700 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-cyber-amber" />
                ) : (
                  <Moon className="w-4 h-4 text-cyber-blue" />
                )}
              </button>

              {/* Firebase User Profile / Sign In */}
              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-900 dark:text-white transition cursor-pointer"
                  >
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User'}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-cyber-teal text-slate-950 flex items-center justify-center font-bold text-[10px]">
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:inline max-w-[100px] truncate text-[11px] font-bold">
                      {currentUser.displayName || currentUser.email}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 p-2 rounded-2xl cyber-card-elevated shadow-2xl border border-slate-200 dark:border-white/10 space-y-1 z-50 animate-in fade-in">
                      <div className="px-2 py-1 text-[11px] text-slate-600 dark:text-cyber-text-secondary truncate border-b border-slate-200 dark:border-white/5 mb-1">
                        {currentUser.email}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenPrivacy && onOpenPrivacy();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-cyber-text-secondary" />
                        <span>Settings & Privacy</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          onSignOut();
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-teal text-slate-950 font-black text-xs shadow-cyber-glow-teal hover:opacity-95 transition cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(true)}
              aria-label="Open mobile navigation menu"
              className="sm:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 transition cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation & Account Drawer */}
      <MobileMenuDrawer
        isOpen={showMobileMenu}
        onClose={() => setShowMobileMenu(false)}
        activeTab={activeTab}
        onChangeTab={onChangeTab}
        theme={theme}
        onToggleTheme={onToggleTheme}
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        onSignOut={onSignOut}
        onOpenPrivacy={onOpenPrivacy}
        selectedCity={selectedCity}
      />
    </>
  );
}
