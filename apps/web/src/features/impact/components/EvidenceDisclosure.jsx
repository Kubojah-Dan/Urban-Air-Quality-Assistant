import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export function EvidenceDisclosure({ limitations = [] }) {
  return (
    <div className="cyber-card p-5 sm:p-6 rounded-[24px] space-y-2 text-xs border border-slate-200 dark:border-white/10">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-cyber-teal flex-shrink-0" />
        <h4 className="font-extrabold text-slate-900 dark:text-white text-xs font-display">
          Evidence Caveats & Scientific Provenance
        </h4>
      </div>
      <p className="text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
        Forecast data is provided by numerical models (Copernicus CAMS) representing regional averages
        (~45 km) and not street-level canyon sensors. Air quality data does not equate to personal inhaled
        dose.
      </p>
      {limitations.length > 0 && (
        <ul className="list-disc pl-4 space-y-0.5 text-slate-500 dark:text-cyber-text-muted mt-2 text-[11px]">
          {limitations.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
