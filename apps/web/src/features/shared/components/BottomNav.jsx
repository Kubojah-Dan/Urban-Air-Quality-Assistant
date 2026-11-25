import React from 'react';
import { Home, Calendar, Wind, Compass, FileText } from 'lucide-react';

/**
 * BottomNav
 *
 * Ultra-clean, mobile-first floating navigation island.
 * Focuses on the 5 daily core pillars with comfortable touch targets (48px+)
 * and luminous active pill indicators. Prevents visual crowding on small phones.
 */
export function BottomNav({ activeTab, onChangeTab }) {
  const tabs = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'routine', label: 'Routine', icon: Calendar },
    { id: 'indoor', label: 'Indoor', icon: Wind },
    { id: 'explorer', label: 'Explore', icon: Compass },
    { id: 'impact', label: 'Impact', icon: FileText }
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-between p-1.5 rounded-[28px] bg-white/90 dark:bg-[#0c1427]/90 backdrop-blur-2xl border border-slate-200/80 dark:border-white/15 shadow-2xl shadow-cyan-950/20">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-cyber-teal text-slate-950 font-black shadow-cyber-glow-teal scale-102'
                  : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform ${
                  isActive ? 'scale-110 text-slate-950 stroke-[2.5]' : 'stroke-2'
                }`}
              />
              <span className={`text-[10px] mt-0.5 tracking-tight font-display ${isActive ? 'font-black' : 'font-semibold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
