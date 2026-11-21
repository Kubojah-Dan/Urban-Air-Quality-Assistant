import React from 'react';
import { ImpactReceipt } from '../../impact/components/ImpactReceipt.jsx';
import { Clock, Navigation, CheckCircle, Sparkles, ShieldCheck } from 'lucide-react';

/**
 * OptionCard
 *
 * Futuristic Option Card with smooth 28px rounded corners:
 * - 1. Usual Plan (Baseline)
 * - 2. Recommended Change (highlighted with glowing neon teal accent)
 * - 3. Practical Backup Plan
 * Crystal-clear contrast in both Light Mode (slate-900) and Dark Mode (white).
 */
export function OptionCard({ candidate, receipt, variant, isSelected, onSelect }) {
  if (!candidate) return null;

  const isRecommended = variant === 'recommended';

  const badgeConfig = {
    usual: {
      label: '1. Usual Plan (Baseline)',
      badge: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-white/10 dark:text-cyber-text-secondary dark:border-white/15',
      container: 'cyber-card hover:border-slate-300 dark:hover:border-white/20'
    },
    recommended: {
      label: '2. Recommended Change',
      badge: 'bg-cyber-teal text-slate-950 font-black shadow-cyber-glow-teal border-transparent',
      container: 'cyber-card-elevated border-cyber-teal/50 shadow-cyber-glow-teal ring-1 ring-cyber-teal/40'
    },
    backup: {
      label: '3. Practical Backup Plan',
      badge: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-cyber-blue/20 dark:text-cyber-blue dark:border-cyber-blue/30 font-bold',
      container: 'cyber-card hover:border-sky-300 dark:hover:border-cyber-blue/30'
    }
  };

  const config = badgeConfig[variant] || badgeConfig.usual;

  const formatMinutes = (mins) => {
    if (mins == null) return '--:--';
    const h = String(Math.floor(mins / 60)).padStart(2, '0');
    const m = String(mins % 60).padStart(2, '0');
    return `${h}:${m}`;
  };

  return (
    <article
      className={`p-6 rounded-[28px] border flex flex-col justify-between transition-all space-y-4 ${config.container}`}
    >
      <div className="space-y-3.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-3 py-1 rounded-full border shadow-xs ${config.badge}`}>
            {config.label}
          </span>
          <span className="text-[10px] font-bold text-slate-700 dark:text-cyber-text-secondary uppercase tracking-wider bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-white/10">
            {candidate.mode}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight font-display">
            {candidate.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-1 leading-relaxed">
            {candidate.description}
          </p>
        </div>

        {/* Timing Window Strip */}
        <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-cyber-text-muted" />
            <span className="font-bold">Depart: {formatMinutes(candidate.departureMinutes)}</span>
          </div>
          <span className="text-slate-300 dark:text-white/20">•</span>
          <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
            <Navigation className="w-3.5 h-3.5 text-slate-500 dark:text-cyber-text-muted" />
            <span className="font-bold">Arrive: {formatMinutes(candidate.arrivalMinutes)}</span>
          </div>
        </div>

        {/* Satisfied Constraints & Key Trade-offs */}
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-cyber-text-muted">
            Feasibility & Constraints
          </h4>
          <ul className="text-xs space-y-1.5">
            {candidate.satisfiedConstraints?.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyber-teal flex-shrink-0 mt-0.5" />
                <span className="text-xs text-slate-700 dark:text-cyber-text-secondary">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Embedded Impact Receipt */}
      <div className="pt-2">
        <ImpactReceipt receipt={receipt} />
      </div>
    </article>
  );
}
