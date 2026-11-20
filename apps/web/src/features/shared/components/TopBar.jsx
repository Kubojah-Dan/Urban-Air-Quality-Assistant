import React from 'react';
import { Wind, ShieldCheck } from 'lucide-react';

export function TopBar() {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur px-4 py-3 sticky top-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wind className="w-6 h-6 text-brand-600" />
          <span className="font-semibold text-lg tracking-tight">DayShift</span>
          <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full border border-stone-200">
            Assistant
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy First • No Continuous GPS</span>
        </div>
      </div>
    </header>
  );
}
