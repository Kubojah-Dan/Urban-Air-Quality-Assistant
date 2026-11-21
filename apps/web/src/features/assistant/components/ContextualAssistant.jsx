import React, { useState } from 'react';
import { HelpCircle, RefreshCw, Ban, Clock, Bus, Check, ArrowRight } from 'lucide-react';

export function ContextualAssistant({ onReviseConstraint, isLoading = false, revisionLog = [] }) {
  const [selectedPreset, setSelectedPreset] = useState('');
  const [newArrivalTime, setNewArrivalTime] = useState('08:30');
  const [newDepartureTime, setNewDepartureTime] = useState('08:30');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleApplyPreset = (type, val) => {
    setSelectedPreset(type);
    onReviseConstraint({
      type,
      parameter: type,
      value: val,
      description:
        type === 'transitUnavailable'
          ? val
            ? 'Transit is not available for this trip'
            : 'Public transit is now available'
          : type === 'cannotLeaveEarlier'
            ? `Cannot leave earlier than ${val}`
            : `Must arrive by ${val}`
    });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    // Simple natural language intent mapper for common what-if queries
    const text = customPrompt.toLowerCase();
    if (text.includes('transit') && (text.includes('no') || text.includes('not') || text.includes('unavail') || text.includes('strike'))) {
      handleApplyPreset('transitUnavailable', true);
    } else if (text.includes('transit') && (text.includes('use') || text.includes('take') || text.includes('avail') || text.includes('metro'))) {
      handleApplyPreset('transitUnavailable', false);
    } else if (text.includes('leave') || text.includes('depart')) {
      const match = text.match(/\b([01]?[0-9]|2[0-3]):[0-5][0-9]\b/);
      const time = match ? match[0] : newDepartureTime;
      handleApplyPreset('cannotLeaveEarlier', time);
    } else if (text.includes('arrive') || text.includes('reach')) {
      const match = text.match(/\b([01]?[0-9]|2[0-3]):[0-5][0-9]\b/);
      const time = match ? match[0] : newArrivalTime;
      handleApplyPreset('mustArriveBy', time);
    } else {
      // Default to tightening arrival deadline
      handleApplyPreset('mustArriveBy', newArrivalTime);
    }
    setCustomPrompt('');
  };

  return (
    <div className="bg-white p-5 border border-stone-200 rounded-2xl shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <h3 className="font-bold text-stone-900 text-sm">“What if…?” Contextual Assistant</h3>
        </div>
        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
          In-Place Replanner
        </span>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        Test a constraint change without leaving the page. Only the affected candidate will recalculate,
        keeping your usual plan baseline stable.
      </p>

      {/* Quick Constraint Modifiers */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
          Quick Adjustments
        </span>

        <div className="grid gap-2">
          {/* Preset 1: Cannot leave earlier */}
          <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
            <span className="font-medium text-stone-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              Cannot leave earlier than:
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="time"
                value={newDepartureTime}
                onChange={(e) => setNewDepartureTime(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-900"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleApplyPreset('cannotLeaveEarlier', newDepartureTime)}
                className="px-2.5 py-1 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition disabled:opacity-50 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Preset 2: Must arrive by new time */}
          <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
            <span className="font-medium text-stone-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              New arrival deadline:
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="time"
                value={newArrivalTime}
                onChange={(e) => setNewArrivalTime(e.target.value)}
                className="bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs text-stone-900"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleApplyPreset('mustArriveBy', newArrivalTime)}
                className="px-2.5 py-1 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition disabled:opacity-50 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Preset 3: Transit toggle */}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleApplyPreset('transitUnavailable', true)}
              className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:border-stone-400 transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Ban className="w-3.5 h-3.5 text-rose-600" />
              <span>Transit Unavailable</span>
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleApplyPreset('transitUnavailable', false)}
              className="flex-1 p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:border-stone-400 transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
            >
              <Bus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Transit Available</span>
            </button>
          </div>
        </div>
      </div>

      {/* Free-text What-If Input */}
      <form onSubmit={handleCustomSubmit} className="space-y-2 pt-1 border-t border-stone-100">
        <label htmlFor="what-if-prompt" className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
          Ask a specific “What If…” question
        </label>
        <div className="flex gap-2">
          <input
            id="what-if-prompt"
            type="text"
            placeholder="e.g. What if I can't leave before 08:15?"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={isLoading || !customPrompt.trim()}
            className="px-3.5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition disabled:opacity-50 flex items-center gap-1 cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </form>

      {/* Scoped Revision Notice */}
      {revisionLog && revisionLog.length > 0 && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
          <span className="font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            Scoped Plan Revision Applied
          </span>
          <ul className="text-[11px] text-emerald-700 list-disc pl-4 space-y-0.5">
            {revisionLog.map((log, i) => (
              <li key={i}>{log}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
