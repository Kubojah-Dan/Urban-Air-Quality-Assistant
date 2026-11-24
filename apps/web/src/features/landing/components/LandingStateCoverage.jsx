import React from 'react';
import { CITIES } from '../../location/data/cities.js';

/**
 * LandingStateCoverage Component
 *
 * Displays national coverage across all 28 Indian States & Union Territories.
 */
export function LandingStateCoverage() {
  const indianStates = Array.from(
    new Set(CITIES.filter((c) => c.countryCode === 'IN').map((c) => c.state))
  ).filter(Boolean);

  return (
    <section className="cyber-card p-6 sm:p-8 rounded-[32px] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
            National Footprint
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
            Covering All 28 Indian States & Union Territories
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-600 dark:text-cyber-text-secondary">
          Continuous CPCB + Copernicus CAMS Regional Ingestion
        </div>
      </div>

      {/* State Badges Grid */}
      <div className="flex flex-wrap gap-2 pt-2">
        {indianStates.map((state) => (
          <span
            key={state}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white hover:border-cyber-teal hover:text-cyber-teal transition-all cursor-default"
          >
            {state}
          </span>
        ))}
      </div>
    </section>
  );
}
