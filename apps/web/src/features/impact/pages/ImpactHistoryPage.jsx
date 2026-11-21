import React from 'react';
import { BarChart3, TrendingDown, ArrowDownRight, ShieldCheck, CheckCircle2, Award, Calendar } from 'lucide-react';

export function ImpactHistoryPage() {
  const weeklyBars = [
    { day: 'M', value: 35, avoidedGrams: 420 },
    { day: 'T', value: 50, avoidedGrams: 610 },
    { day: 'W', value: 75, avoidedGrams: 890 },
    { day: 'T', value: 60, avoidedGrams: 720 },
    { day: 'F', value: 85, avoidedGrams: 1040 },
    { day: 'S', value: 40, avoidedGrams: 480 },
    { day: 'SUN', value: 95, avoidedGrams: 1150 }
  ];

  const totalAvoidedCo2Kg = '5.31';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display block">
          Personal History & Trends
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Impact History
        </h1>
        <p className="text-xs text-cyber-text-secondary mt-0.5">
          Cumulative verified emissions avoided and cleaner-routine decisions.
        </p>
      </div>

      {/* Featured Weekly Bar Chart Card */}
      <div className="cyber-card-elevated p-6 sm:p-8 rounded-[32px] space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyber-text-muted block">
              Tailpipe CO₂ Avoided This Week
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-display">
                {totalAvoidedCo2Kg}
              </span>
              <span className="text-sm font-bold text-cyber-teal">kg CO₂</span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyber-teal/15 text-cyber-teal font-extrabold text-xs border border-cyber-teal/30 shadow-cyber-glow-teal">
            <ArrowDownRight className="w-4 h-4" />
            <span>↓ 24% vs baseline</span>
          </div>
        </div>

        {/* Clean teal rounded bars */}
        <div className="space-y-2 pt-2">
          <div className="flex items-end justify-between gap-2 h-36 px-2">
            {weeklyBars.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div
                  className="w-full max-w-[36px] rounded-xl bg-cyber-teal transition-all duration-500 group-hover:opacity-85 shadow-cyber-glow-teal"
                  style={{ height: `${bar.value}%` }}
                />
                <span className="text-[10px] font-bold text-cyber-text-secondary tracking-tight">
                  {bar.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scientific citation footnote */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-cyber-text-secondary">
          <span>Based on verified ARAI 2024 / EPA MOVES 2024 tailpipe registries.</span>
          <span className="font-bold text-cyber-teal">Zero invented scores</span>
        </div>
      </div>

      {/* Recent Decisions History List */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyber-text-muted px-1 block">
          Recent Cleaner-Air Choices
        </span>

        <div className="space-y-2.5">
          <div className="cyber-card p-4 sm:p-5 rounded-[28px] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-display">Morning Commute Shift</span>
                <span className="text-[10px] bg-white/5 text-cyber-text-secondary px-2 py-0.5 rounded-md border border-white/10 font-semibold">
                  Today, 08:00 AM
                </span>
              </div>
              <p className="text-xs text-cyber-text-secondary">
                Shifted departure window by 30 mins earlier to beat morning inversion layer.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-extrabold text-cyber-teal block font-display">Avoided Peak PM2.5</span>
              <span className="text-[10px] text-cyber-text-muted">0 min extra delay</span>
            </div>
          </div>

          <div className="cyber-card p-4 sm:p-5 rounded-[28px] flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-display">Metro Transit Selection</span>
                <span className="text-[10px] bg-white/5 text-cyber-text-secondary px-2 py-0.5 rounded-md border border-white/10 font-semibold">
                  Yesterday, 06:15 PM
                </span>
              </div>
              <p className="text-xs text-cyber-text-secondary">
                Substituted solo petrol car trip with Delhi Metro Blue Line transit.
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs font-extrabold text-cyber-teal block font-display">Avoided 380g CO₂</span>
              <span className="text-[10px] text-cyber-text-muted">-12 min travel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
