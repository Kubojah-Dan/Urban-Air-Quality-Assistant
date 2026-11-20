import React from 'react';
import { ImpactReceipt } from '../../impact/components/ImpactReceipt.jsx';

export function OptionCard({ candidate, receipt, variant }) {
  if (!candidate) return null;

  const badgeStyles = {
    usual: 'bg-stone-100 text-stone-700 border-stone-300',
    recommended: 'bg-brand-50 text-brand-700 border-brand-300 font-semibold',
    backup: 'bg-blue-50 text-blue-700 border-blue-300'
  };

  const borderStyles = {
    usual: 'border-stone-200 bg-white',
    recommended: 'border-brand-500 bg-white shadow-sm ring-1 ring-brand-500/20',
    backup: 'border-stone-200 bg-white'
  };

  return (
    <div className={`p-5 rounded-xl border flex flex-col justify-between ${borderStyles[variant]}`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-[11px] px-2 py-0.5 rounded-full border ${badgeStyles[variant]}`}>
            {variant === 'usual'
              ? 'Usual Plan (Baseline)'
              : variant === 'recommended'
                ? 'Recommended Change'
                : 'Practical Backup'}
          </span>
        </div>

        <h3 className="font-bold text-stone-900 text-base">{candidate.title}</h3>
        <p className="text-xs text-stone-600 leading-relaxed">{candidate.description}</p>

        <div className="space-y-1 pt-1">
          <h4 className="text-[11px] font-semibold uppercase text-stone-500">Key Feasibility Points</h4>
          <ul className="text-xs text-stone-600 space-y-1">
            {candidate.satisfiedConstraints?.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-emerald-600 mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-stone-100">
        <ImpactReceipt receipt={receipt} />
      </div>
    </div>
  );
}
