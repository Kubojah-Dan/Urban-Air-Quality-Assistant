import React from 'react';
import { RotateCcw, X } from 'lucide-react';

/**
 * DrawerHeader Component
 *
 * Glassmorphic top navigation bar for the global assistant drawer:
 * Branded DayShift AI Orb, model version tag, telemetry status,
 * trilingual dropdown (EN, HI, TA), restart chat, and close controls.
 *
 * @param {Object} props
 * @param {string} props.activeLanguage
 * @param {(lang: string) => void} props.setActiveLanguage
 * @param {() => void} props.clearConversation
 * @param {() => void} props.onClose
 */
export function DrawerHeader({
  activeLanguage,
  setActiveLanguage,
  clearConversation,
  onClose
}) {
  return (
    <header className="shrink-0 px-4 py-3 sm:py-3.5 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between bg-slate-50/80 dark:bg-black/20 backdrop-blur-md">
      <div className="flex items-center gap-2.5">
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-cyber-teal to-cyber-blue flex items-center justify-center text-slate-950 font-black shadow-cyber-glow-teal shrink-0">
          <span className="font-display text-xs">D</span>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-950 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-extrabold tracking-tight font-display text-slate-900 dark:text-white">
              DayShift AI
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyber-teal/20 text-cyber-teal font-mono font-bold border border-cyber-teal/30">
              2.5 Flash
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-cyber-text-secondary flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live CAMS & CPCB Telemetry</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <select
          value={activeLanguage}
          onChange={(e) => setActiveLanguage(e.target.value)}
          aria-label="Language selection"
          className="text-[11px] font-bold bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-cyber-text-secondary py-1 px-2.5 rounded-full border border-slate-300/80 dark:border-white/15 outline-none cursor-pointer"
        >
          <option value="en">EN</option>
          <option value="hi">हिन्दी</option>
          <option value="ta">தமிழ்</option>
        </select>

        <button
          type="button"
          onClick={clearConversation}
          title="Start new conversation"
          aria-label="New conversation"
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close assistant"
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
