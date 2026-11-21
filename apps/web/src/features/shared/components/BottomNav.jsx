import React from 'react';
import { Home, Calendar, Wind, Search, FileText, Sparkles, Settings } from 'lucide-react';

/**
 * BottomNav
 *
 * Mobile-first floating cyberpunk navigation bar with glowing active indicators.
 */
export function BottomNav({ activeTab, onChangeTab }) {
  const tabs = [
    { id: 'today', label: 'Today', icon: Home },
    { id: 'routine', label: 'Routine', icon: Calendar },
    { id: 'indoor', label: 'Indoor', icon: Wind },
    { id: 'explorer', label: 'Explore', icon: Search },
    { id: 'history', label: 'Impact', icon: FileText },
    { id: 'assistant', label: 'AI', icon: Sparkles },
    { id: 'privacy', label: 'Settings', icon: Settings }
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-3 left-3 right-3 z-40 cyber-nav p-1.5 shadow-2xl"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal font-extrabold'
                  : 'text-cyber-text-secondary hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-slate-950' : 'text-cyber-text-secondary'
                  }`}
                />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-bold">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
