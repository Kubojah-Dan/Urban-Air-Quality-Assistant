import React from 'react';
import { ArrowRight, Compass, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

/**
 * LandingHero Component
 *
 * Primary landing hero section with high-contrast headline, CTA action triggers,
 * clean commute visual banner with ARAI 2024 verification badge, and DPDP privacy chips.
 *
 * @param {Object} props
 * @param {() => void} props.onStartOnboarding - Handler to trigger routine builder
 * @param {() => void} props.onExploreAirQuality - Handler to trigger air quality explorer
 */
export function LandingHero({ onStartOnboarding, onExploreAirQuality }) {
  return (
    <section className="relative overflow-hidden rounded-[28px] sm:rounded-[32px] cyber-card-elevated p-5 sm:p-8 md:p-10 text-center">
      {/* Ambient atmospheric lighting */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-cyber-teal/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-cyber-blue/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-5">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-tight sm:leading-[1.15]">
          Make every day a{' '}
          <span className="text-cyber-teal neon-text-teal">cleaner choice.</span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-cyber-text-secondary font-medium max-w-xl mx-auto leading-relaxed">
          Your day. Your choices. Cleaner air. DayShift delivers realistic, constraint-aware routine guidance,
          verifying what is known, estimated, and unmeasured without demanding continuous GPS or expensive equipment.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 pt-1">
          <button
            type="button"
            onClick={onStartOnboarding}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-2xl bg-cyber-teal text-slate-950 font-black text-xs sm:text-sm shadow-cyber-glow-teal hover:opacity-95 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>Build my daily routine</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onExploreAirQuality}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-xs sm:text-sm border border-slate-300 dark:border-white/15 transition-all cursor-pointer shadow-xs"
          >
            <Compass className="w-4 h-4 text-cyber-blue" />
            <span>Explore air quality</span>
          </button>
        </div>

        {/* Feature Showcase Banner */}
        <div className="pt-3 sm:pt-5">
          <div className="relative w-full h-44 sm:h-64 md:h-72 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-300 dark:border-white/15 shadow-xl group">
            <img
              src="/assets/indian-clean-commute.jpg"
              alt="Modern Clean Urban Mobility in India — Electric Metro & Clean Transit"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-end p-4 sm:p-6 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-cyber-teal bg-black/60 px-2.5 py-0.5 rounded-full border border-cyber-teal/30">
                    Urban Transit Model
                  </span>
                  <h2
                    className="text-base sm:text-xl font-extrabold text-white !text-white font-display"
                    style={{ color: '#FFFFFF' }}
                    data-overlay="true"
                  >
                    Clean Commuting for Modern Indian Metros
                  </h2>
                  <p
                    className="text-[11px] sm:text-xs text-slate-200 !text-slate-200 max-w-lg hidden sm:block"
                    style={{ color: '#E2E8F0' }}
                  >
                    Combining electric buses, metro rail networks, and departure time shifting to avoid peak morning temperature inversions.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15 text-[11px] sm:text-xs text-white">
                  <span className="w-2 h-2 rounded-full bg-cyber-teal animate-pulse" />
                  <span className="font-bold">ARAI 2024 Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Provenance Guarantees */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-cyber-text-secondary">
          <span className="flex items-center gap-1.5 text-slate-800 dark:text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-cyber-teal" />
            Zero continuous GPS tracking
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-white/20">•</span>
          <span className="flex items-center gap-1.5 text-slate-800 dark:text-white">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyber-blue" />
            ARAI 2024 & EPA MOVES factors
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-white/20">•</span>
          <span className="flex items-center gap-1.5 text-slate-800 dark:text-white">
            <Sparkles className="w-3.5 h-3.5 text-cyber-purple" />
            DPDP Act 2023 compliant
          </span>
        </div>
      </div>
    </section>
  );
}
