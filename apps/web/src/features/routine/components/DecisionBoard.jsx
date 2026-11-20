import React from 'react';
import { OptionCard } from './OptionCard.jsx';

export function DecisionBoard({ candidates, impactReceipts }) {
  if (!candidates) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">Today’s Decision Board</h2>
        <span className="text-xs text-stone-500">1 Feasible Change • 1 Backup Plan</span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <OptionCard
          candidate={candidates.usual}
          receipt={impactReceipts?.[candidates.usual?.impactReceiptId]}
          variant="usual"
        />
        <OptionCard
          candidate={candidates.recommended}
          receipt={impactReceipts?.[candidates.recommended?.impactReceiptId]}
          variant="recommended"
        />
        <OptionCard
          candidate={candidates.backup}
          receipt={impactReceipts?.[candidates.backup?.impactReceiptId]}
          variant="backup"
        />
      </div>
    </div>
  );
}
