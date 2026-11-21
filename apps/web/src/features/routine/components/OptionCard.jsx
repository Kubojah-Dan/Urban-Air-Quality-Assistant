import React from 'react';
import { ImpactReceipt } from '../../impact/components/ImpactReceipt.jsx';
import { Clock, Navigation, CheckCircle, ShieldAlert } from 'lucide-react';

export function OptionCard({ candidate, receipt, variant, isSelected, onSelect }) {
  if (!candidate) return null;

  const badgeConfig = {
    usual: {
      label: '1. Usual Plan (Baseline)',
      badge: 'bg-stone-100 text-stone-700 border-stone-300',
      border: 'border-stone-200 bg-white hover:border-stone-300'
    },
    recommended: {
      label: '2. Recommended Change',
      badge: 'bg-brand-50 text-brand-800 border-brand-300 font-bold',
      border: 'border-brand-500 bg-white shadow-xs ring-1 ring-brand-500/30'
    },
    backup: {
      label: '3. Practical Backup Plan',
      badge: 'bg-sky-50 text-sky-800 border-sky-300 font-semibold',
      border: 'border-stone-200 bg-white hover:border-stone-300'
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
      className={`p-4 sm:p-5 rounded-2xl border flex flex-col justify-between transition-all space-y-4 ${config.border}`}
    >
      <div className="space-y-3.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2.5 py-0.5 rounded-full border ${config.badge}`}>
            {config.label}
          </span>
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            Mode: {candidate.mode}
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="font-extrabold text-stone-900 text-base sm:text-lg tracking-tight">
            {candidate.title}
          </h3>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">{candidate.description}</p>
        </div>

        {/* Timing Window Strip */}
        <div className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
          <div className="flex items-center gap-1.5 text-stone-700">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-semibold">Depart: {formatMinutes(candidate.departureMinutes)}</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1.5 text-stone-700">
            <Navigation className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-semibold">Arrive: {formatMinutes(candidate.arrivalMinutes)}</span>
          </div>
        </div>

        {/* Satisfied Constraints & Key Trade-offs */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
            Feasibility & Constraints
          </h4>
          <ul className="text-xs text-stone-700 space-y-1">
            {candidate.satisfiedConstraints?.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{c}</span>
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
