import React from 'react';
import { Wind, ShieldCheck, Settings } from 'lucide-react';

export function TopBar({ onOpenPrivacy }) {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur px-4 py-3 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wind className="w-6 h-6 text-brand-600" />
          <span className="font-extrabold text-lg tracking-tight text-stone-900">DayShift</span>
          <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200 font-medium">
            Urban Assistant
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Continuous GPS • DPDP Compliant</span>
          </div>

          {onOpenPrivacy && (
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Privacy & Rights</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
