import React from 'react';
import { IndoorActionCoach } from '../components/IndoorActionCoach.jsx';
import { ShieldCheck, Wind, CheckCircle2, Leaf, Sun, AlertCircle, Info, Sparkles, Fan, Utensils, Brush, Shield } from 'lucide-react';

export function IndoorPage({ initialContext, outdoorAqi = 18 }) {
  const currentCity = initialContext?.city?.displayName || 'Delhi, India';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display block">
          Household Environmental Safety
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
          Indoor Air Quality Coach
        </h1>
        <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-0.5">
          Science-backed source-control protocols, natural ventilation schedules, and mechanical filtration for {currentCity.split(',')[0]}.
        </p>
      </div>

      {/* Sensor Disclaimer & Boundary Transparency Banner */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-cyber-teal shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-extrabold text-slate-900 dark:text-white">
            Sensor Measurement Boundary & Methodology:
          </span>
          <p className="text-slate-600 dark:text-cyber-text-secondary leading-relaxed text-[11px]">
            Without dedicated indoor physical sensors, indoor particulate and VOC levels are <strong>not directly measured</strong>. All recommendations are synthesized from outdoor ambient CAMS telemetry, building envelope infiltration physics, and EPA / WHO source-control protocols. No fabricated indoor AQI numbers are produced.
          </p>
        </div>
      </div>

      {/* Lively Indian Indoor Wellness Hero Banner */}
      <div className="cyber-card rounded-[28px] overflow-hidden border border-slate-300 dark:border-white/15 shadow-xl relative group">
        <div className="aspect-[21/9] sm:aspect-[2.5/1] w-full relative overflow-hidden">
          <img
            src="/assets/indian-indoor-wellness.jpg"
            alt="Contemporary Indian Living Room with Air Purifier and Plants"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyber-teal bg-black/60 px-2.5 py-1 rounded-full border border-cyber-teal/30">
                Source Control & Filtration
              </span>
              <h2
                className="text-xl sm:text-2xl font-extrabold text-white !text-white font-display"
                style={{ color: '#FFFFFF' }}
                data-overlay="true"
              >
                Clean Indoor Living for Indian Apartments
              </h2>
              <p
                className="text-xs text-slate-200 !text-slate-200 max-w-xl hidden sm:block"
                style={{ color: '#E2E8F0' }}
              >
                Pairing source control during tadka cooking with HEPA air purifiers and air-purifying indoor flora (Areca Palm & Sansevieria).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Natural Ventilation Timing Grid */}
      <div className="cyber-card p-5 sm:p-6 rounded-[28px] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyber-teal/20 text-cyber-teal">
              <Wind className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-display">
              Smart Ventilation Timing (Outdoor Context Aware)
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-full text-slate-700 dark:text-cyber-text-secondary border border-slate-200 dark:border-white/10">
            Never Open When High PM2.5
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-cyber-teal/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>01:00 PM - 03:30 PM (Optimal Purge Window)</span>
              </span>
              <span className="text-[10px] font-extrabold bg-cyber-teal text-slate-950 px-2 py-0.5 rounded-full uppercase">
                Recommended
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              Solar radiation breaks morning thermal inversion layer. Outdoor particulate levels reach daytime trough. Open opposite windows for 20-30 minutes to vent indoor carbon dioxide, radon, and cooking moisture.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span>07:00 AM - 09:30 AM (Morning Ground Inversion)</span>
              </span>
              <span className="text-[10px] font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase">
                Keep Closed
              </span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
              Cool ground air traps vehicle exhaust and biomass smoke near surface level. Opening windows during morning rush hour causes ambient fine particulates (PM2.5) to infiltrate living spaces.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pillars of Science-Backed Indoor Source Control */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="cyber-card p-4 rounded-2xl space-y-2">
          <div className="p-2 rounded-xl bg-cyber-teal/20 text-cyber-teal w-fit">
            <Utensils className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
            Cooking & Tadka Control
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary leading-snug">
            Run kitchen vented range hood on high speed before igniting gas burners. Use rear burners where hood capture efficiency reaches 80%+.
          </p>
        </div>

        <div className="cyber-card p-4 rounded-2xl space-y-2">
          <div className="p-2 rounded-xl bg-cyber-blue/20 text-cyber-blue w-fit">
            <Brush className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
            Dust Reduction Protocol
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary leading-snug">
            Use damp microfiber mops instead of dry brooms. Dry sweeping aerosolizes settled PM10 dust back into breathing zones for 2-3 hours.
          </p>
        </div>

        <div className="cyber-card p-4 rounded-2xl space-y-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500 w-fit">
            <Shield className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
            Safe Cleaning Practices
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary leading-snug">
            Avoid pine and citrus terpenoid scented sprays. Limonene reacts rapidly with ambient ozone to form secondary organic aerosols and formaldehyde.
          </p>
        </div>

        <div className="cyber-card p-4 rounded-2xl space-y-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 w-fit">
            <Fan className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
            Mechanical HEPA Purifiers
          </h4>
          <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary leading-snug">
            Ensure Clean Air Delivery Rate (CADR) matches room volume (at least 4-5 air changes per hour). Avoid unverified ionizing purifiers that generate ozone.
          </p>
        </div>
      </div>

      {/* Interactive Action Coach Component with Emergency CO Override */}
      <div className="cyber-card p-6 sm:p-8 rounded-[32px]">
        <IndoorActionCoach
          householdContext={initialContext?.initialContext}
          outdoorAqi={outdoorAqi}
        />
      </div>
    </div>
  );
}
