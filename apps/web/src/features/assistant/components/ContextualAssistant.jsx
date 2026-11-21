import React, { useState } from 'react';
import { HelpCircle, RefreshCw, Clock, Navigation, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

/**
 * ContextualAssistant
 *
 * In-Place Replanner for the Today Page.
 * Styled with cyber-card, rounded-[28px], and 100% adaptive contrast
 * for both Dark Mode (#10202B) and Light Mode (#FFFFFF).
 */
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
      handleApplyPreset('mustArriveBy', newArrivalTime);
    }
    setCustomPrompt('');
  };

  return (
    <div className="cyber-card p-6 sm:p-7 rounded-[28px] space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyber-teal/20 flex items-center justify-center text-cyber-teal">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-display">
              “What if…?” Contextual Assistant
            </h3>
            <span className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
              Test constraint adjustments without altering your fixed commitments
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white px-3 py-1 rounded-full font-bold border border-slate-300 dark:border-white/15">
          In-Place Replanner
        </span>
      </div>

      <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
        Test a constraint change in real time. Only the affected candidate recalculates, keeping your usual plan baseline completely stable.
      </p>

      {/* Quick Constraint Modifiers */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-cyber-text-secondary block">
          Quick Adjustments
        </span>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Preset 1: Cannot leave earlier */}
          <div className="flex items-center justify-between p-3.5 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-xs">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyber-teal" />
              Cannot leave earlier:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={newDepartureTime}
                onChange={(e) => setNewDepartureTime(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl px-2 py-1 text-xs text-slate-900 dark:text-white font-bold"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleApplyPreset('cannotLeaveEarlier', newDepartureTime)}
                className="px-3 py-1.5 bg-cyber-teal text-slate-950 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Preset 2: Must arrive by new time */}
          <div className="flex items-center justify-between p-3.5 bg-slate-100/80 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-xs">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyber-blue" />
              New arrival deadline:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={newArrivalTime}
                onChange={(e) => setNewArrivalTime(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/20 rounded-xl px-2 py-1 text-xs text-slate-900 dark:text-white font-bold"
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleApplyPreset('mustArriveBy', newArrivalTime)}
                className="px-3 py-1.5 bg-cyber-teal text-slate-950 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Transit Feasibility Toggles */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => handleApplyPreset('transitUnavailable', true)}
            className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 hover:border-amber-400 text-xs font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>🚫 Transit Unavailable</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('transitUnavailable', false)}
            className="p-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/5 hover:border-cyber-teal text-xs font-bold text-slate-800 dark:text-white flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <span>🚆 Transit Feasible</span>
          </button>
        </div>
      </div>

      {/* Natural Language Replanner Input */}
      <form onSubmit={handleCustomSubmit} className="pt-2 space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-cyber-text-secondary block">
          Ask a Specific "What if...?" Question
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. What if I can't leave before 08:15?"
            className="flex-1 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyber-teal font-medium"
          />
          <button
            type="submit"
            disabled={!customPrompt.trim() || isLoading}
            className="px-5 py-2.5 bg-cyber-teal text-slate-950 rounded-2xl font-black text-xs hover:opacity-90 transition disabled:opacity-40 cursor-pointer shadow-cyber-glow-teal flex items-center gap-1.5"
          >
            <span>Replanning</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Revision History Log */}
      {revisionLog?.length > 0 && (
        <div className="p-3.5 bg-slate-100/90 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 text-xs">
          <span className="font-bold text-slate-900 dark:text-white text-[11px]">Recent In-Place Revisions:</span>
          <ul className="space-y-1 text-slate-600 dark:text-cyber-text-secondary text-[11px]">
            {revisionLog.map((log, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyber-teal shrink-0" />
                <span>{log.description || log}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
