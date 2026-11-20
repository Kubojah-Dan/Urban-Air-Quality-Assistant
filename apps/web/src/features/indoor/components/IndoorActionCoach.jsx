import React from 'react';
import { Home, ShieldAlert } from 'lucide-react';
import { useIndoorGuidance } from '../hooks/useIndoorGuidance.js';

export function IndoorActionCoach() {
  const { data } = useIndoorGuidance();
  const guidanceList = data?.guidance || [];

  return (
    <div className="bg-white p-5 border border-stone-200 rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <Home className="w-5 h-5 text-brand-600" />
        <h3 className="font-semibold text-stone-900 text-sm">Reviewed Indoor Guidance</h3>
      </div>
      <p className="text-xs text-stone-500">
        Prioritizes source control and ventilation without demanding equipment purchases.
      </p>

      <div className="space-y-2 pt-1">
        {guidanceList.slice(0, 2).map((item) => (
          <div key={item.id} className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs">
            <span className="font-semibold text-stone-800 block">{item.action}</span>
            <span className="text-[10px] text-stone-500 uppercase mt-1 block">
              Mechanism: {item.mechanism}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t border-stone-100 flex items-center gap-2 text-[11px] text-amber-700">
        <ShieldAlert className="w-4 h-4 flex-shrink-0" />
        <span>CO Alarm? Evacuate immediately. Emergency advice overrides routine plans.</span>
      </div>
    </div>
  );
}
