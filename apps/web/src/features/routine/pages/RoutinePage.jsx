import React, { useState } from 'react';
import { Clock, Plus, ArrowRight, ShieldCheck, Car, Train, Bike, Wind, Sparkles, CheckCircle2 } from 'lucide-react';

export function RoutinePage({ initialContext, onSwitchToToday }) {
  const [activeSegment, setActiveSegment] = useState('morning');

  const segments = [
    { id: 'morning', label: 'Morning (06:00 - 12:00)' },
    { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
    { id: 'evening', label: 'Evening (17:00 - 21:00)' },
    { id: 'night', label: 'Night (21:00 - 06:00)' }
  ];

  const routineSteps = [
    {
      id: 1,
      time: '08:00 AM',
      title: 'Depart for Office Commute',
      subtitle: 'Usual: Car (Petrol) with windows down',
      improved: 'Recommended: Car with AC cabin recirculation + HEPA',
      timeDelta: '0 min delay',
      emissionsDelta: 'No tailpipe change',
      exposureDelta: 'Reduced in-cabin PM2.5 infiltration'
    },
    {
      id: 2,
      time: '08:30 AM',
      title: 'Morning Errand / Coffee Stop',
      subtitle: 'Usual: Street-side roadside kiosk',
      improved: 'Alternative: Indoor ventilated venue 100m away',
      timeDelta: '+4 min walk',
      emissionsDelta: '0g CO2',
      exposureDelta: 'Bypasses morning diesel curb plume'
    },
    {
      id: 3,
      time: '01:00 PM',
      title: 'Lunchtime Outdoor Walk',
      subtitle: 'Usual: 30-minute roadside loop',
      improved: 'Alternative: Shaded tree canopy park route',
      timeDelta: 'Same duration',
      emissionsDelta: 'Zero emissions',
      exposureDelta: 'Lower localized ozone / particulate exposure'
    },
    {
      id: 4,
      time: '06:15 PM',
      title: 'Evening Return Commute',
      subtitle: 'Usual: Peak-traffic drive 06:15 - 07:15 PM',
      improved: 'Alternative: Metro transit departure at 06:30 PM',
      timeDelta: '-10 min travel time',
      emissionsDelta: 'Avoids ~380g CO2 (ARAI 2024)',
      exposureDelta: 'Filtered underground rolling stock'
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display block">
            Daily Routine Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            My Daily Routine
          </h1>
          <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-0.5">
            Optimize your daily timeline for cleaner-air choices without altering fixed commitments.
          </p>
        </div>

        {onSwitchToToday && (
          <button
            type="button"
            onClick={onSwitchToToday}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-cyber-teal text-slate-950 font-black text-xs shadow-cyber-glow-teal hover:opacity-95 transition cursor-pointer"
          >
            <span>Today’s 3-Way Board</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Time-of-Day Segmented Control */}
      <div className="cyber-card p-1.5 rounded-2xl flex flex-wrap gap-1 shadow-xs">
        {segments.map((seg) => (
          <button
            key={seg.id}
            type="button"
            onClick={() => setActiveSegment(seg.id)}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
              activeSegment === seg.id
                ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal font-display'
                : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            {seg.label}
          </button>
        ))}
      </div>

      {/* Numbered Routine Steps */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-cyber-text-muted">
            Timeline Steps • In Order
          </span>
          <span className="text-[11px] text-cyber-teal font-bold">
            All Constraints Respected
          </span>
        </div>

        <div className="space-y-3">
          {routineSteps.map((step) => (
            <div
              key={step.id}
              className="cyber-card p-5 rounded-[28px] space-y-3.5 hover:border-slate-300 dark:hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  {/* Numbered circular badge */}
                  <div className="w-8 h-8 rounded-full bg-cyber-teal text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-display shadow-cyber-glow-teal">
                    {step.id}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                        {step.title}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-cyber-text-secondary bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-cyber-text-secondary">{step.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Improved Alternative Comparison Pill */}
              <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-cyber-teal/10 border border-teal-200 dark:border-cyber-teal/30 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-white">
                  <Sparkles className="w-3.5 h-3.5 text-cyber-teal shrink-0" />
                  <span>{step.improved}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold pt-0.5">
                  <span className="bg-white dark:bg-white/10 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white shadow-2xs">
                    ⏱ {step.timeDelta}
                  </span>
                  <span className="bg-emerald-100 dark:bg-white/10 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-white/10 text-emerald-900 dark:text-cyber-teal font-bold shadow-2xs">
                    🌿 {step.emissionsDelta}
                  </span>
                  <span className="bg-sky-100 dark:bg-white/10 px-2.5 py-1 rounded-lg border border-sky-300 dark:border-white/10 text-sky-900 dark:text-cyber-blue font-bold shadow-2xs">
                    🛡 {step.exposureDelta}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
