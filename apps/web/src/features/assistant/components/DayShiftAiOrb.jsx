import React from 'react';
import { Sparkles } from 'lucide-react';
import { useGlobalAssistant } from '../context/AssistantContext.jsx';

/**
 * DayShiftAiOrb
 *
 * Distinctive global floating chatbot launcher inspired by the DayShift brand logo:
 * - Glassmorphic navy/teal gradient with ambient pulse ring
 * - Stylized geometric 'D' curvature + dynamic aerodynamic leaf stroke
 * - Warm amber sun highlight node
 * - Smooth desktop & mobile safe positioning above bottom navigation
 */
export function DayShiftAiOrb() {
  const { isOpen, setIsOpen } = useGlobalAssistant();

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 select-none">
      {/* Ambient glowing ripple when closed */}
      {!isOpen && (
        <span className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyber-teal via-cyber-blue to-amber-400 opacity-40 blur-md animate-pulse pointer-events-none" />
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close DayShift AI Assistant' : 'Open DayShift AI Assistant'}
        aria-expanded={isOpen}
        className={`relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all duration-300 transform active:scale-95 cursor-pointer backdrop-blur-xl border shadow-2xl ${
          isOpen
            ? 'bg-cyber-teal text-slate-950 border-white/40 shadow-cyber-glow-teal rotate-90'
            : 'bg-gradient-to-br from-[#0c162d]/95 via-[#0f283d]/95 to-[#0b3338]/95 dark:from-[#0a1224]/95 dark:to-[#07242a]/95 text-white border-cyber-teal/40 hover:border-cyber-teal hover:scale-105 shadow-cyber-glow-teal/40'
        }`}
      >
        {isOpen ? (
          <span className="text-xl font-black">✕</span>
        ) : (
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center">
            {/* Minimalist DayShift Emblem: Stylized D + Leaf + Amber Sun */}
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-md transition-transform group-hover:scale-110"
            >
              <defs>
                <linearGradient id="orbLeafGrad" x1="15%" y1="15%" x2="90%" y2="90%">
                  <stop offset="0%" stopColor="#00F5D4" />
                  <stop offset="100%" stopColor="#00BBF9" />
                </linearGradient>
                <radialGradient id="orbSunGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFBE0B" />
                  <stop offset="100%" stopColor="#FB5607" />
                </radialGradient>
              </defs>

              {/* Glass D Backbone */}
              <path
                d="M30 18 H52 C68 18 78 30 78 50 C78 70 68 82 52 82 H30 Z"
                stroke="url(#orbLeafGrad)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-90"
              />

              {/* Aerodynamic Air/Leaf Flow Accent */}
              <path
                d="M38 58 Q 55 35 74 38 Q 62 68 38 58 Z"
                fill="url(#orbLeafGrad)"
                className="opacity-95"
              />

              {/* Amber Sun Highlight Node */}
              <circle
                cx="72"
                cy="26"
                r="7"
                fill="url(#orbSunGrad)"
                className="animate-pulse"
              />
            </svg>

            {/* Sparkle micro-badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-2 h-2 text-slate-950" />
            </span>
          </div>
        )}

        {/* Desktop Hover Tooltip */}
        <span className="hidden sm:group-hover:block absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-bold whitespace-nowrap border border-white/10 shadow-xl backdrop-blur-md pointer-events-none">
          {isOpen ? 'Close DayShift AI' : 'Ask DayShift AI'}
        </span>
      </button>
    </div>
  );
}
