import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { useReplanner } from '../hooks/useReplanner.js';

export function ContextualAssistant({ onReviseConstraint }) {
  const { submitChange } = useReplanner(onReviseConstraint);
  const [newTime, setNewTime] = useState('08:30');

  return (
    <div className="bg-white p-5 border border-stone-200 rounded-xl space-y-3">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-brand-600" />
        <h3 className="font-semibold text-stone-900 text-sm">“What if…” Assistant</h3>
      </div>
      <p className="text-xs text-stone-500">
        Change one constraint to recalculate your options. Only the affected candidate will update.
      </p>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="bg-stone-50 border border-stone-300 rounded-lg p-2 text-xs"
        />
        <button
          onClick={() => submitChange('mustArriveBy', newTime)}
          className="px-3 py-2 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-stone-800 transition"
        >
          Replan with New Arrival
        </button>
      </div>
    </div>
  );
}
