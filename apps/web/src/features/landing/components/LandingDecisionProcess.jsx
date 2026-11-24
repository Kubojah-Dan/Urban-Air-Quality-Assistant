import React from 'react';

/**
 * LandingDecisionProcess Component
 *
 * 3-step decision flow explaining evidence-grounded optimization and signature Impact Receipt callout.
 *
 * @param {Object} props
 * @param {() => void} props.onStartOnboarding
 */
export function LandingDecisionProcess({ onStartOnboarding }) {
  return (
    <>
      <section className="cyber-card p-8 sm:p-10 rounded-[32px] space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
            Evidence-First Flow
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            How DayShift works in three simple steps
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black flex items-center justify-center text-sm shadow-md font-display">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Select Your State & Schedule</h4>
            <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
              Choose from all 28 Indian States and UTs. Enter your commute hours without sharing exact GPS coordinates.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-cyber-teal text-slate-950 font-black flex items-center justify-center text-sm shadow-cyber-glow-teal font-display">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Live Regional Ingestion</h4>
            <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
              Cross-checks Copernicus CAMS hourly forecasts and CPCB stations with official ARAI 2024 emission factors.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-cyber-blue text-slate-950 font-black flex items-center justify-center text-sm shadow-cyber-glow-blue font-display">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Get Your Impact Receipt</h4>
            <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
              Review transparent trade-offs, ask the AI assistant for scoped adjustments, or test household air safety.
            </p>
          </div>
        </div>
      </section>

      {/* Signature Impact Receipt Callout */}
      <section className="cyber-card-elevated p-6 sm:p-10 rounded-[32px] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] uppercase font-black tracking-widest text-cyber-teal font-display">
              Signature Analytical Report
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              The 3-Channel Impact Receipt
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-cyber-text-secondary max-w-xl leading-relaxed">
              Never an invented aggregate "clean score." DayShift clearly separates ambient outdoor air context,
              indoor mitigation mechanisms, and verified tailpipe emissions deltas.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartOnboarding}
            className="flex-shrink-0 px-8 py-4 rounded-2xl bg-cyber-teal text-slate-950 font-black text-xs hover:opacity-95 transition shadow-cyber-glow-teal cursor-pointer"
          >
            Try Interactive Demo
          </button>
        </div>
      </section>
    </>
  );
}
