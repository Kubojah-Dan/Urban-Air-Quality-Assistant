import React, { useState } from 'react';
import { Home, ShieldAlert, Wind, CheckCircle2, AlertTriangle, Flame, AlertOctagon, Sparkles } from 'lucide-react';
import { useIndoorGuidance } from '../hooks/useIndoorGuidance.js';

export function IndoorActionCoach({ outdoorPm25 = 80 }) {
  // Context questions
  const [cookingNow, setCookingNow] = useState(false);
  const [ventedHood, setVentedHood] = useState(true);
  const [burningSensors, setBurningSensors] = useState(false);
  const [coAlarmTriggered, setCoAlarmTriggered] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('living');

  const { data: guidanceData, isLoading } = useIndoorGuidance(cookingNow ? 'cooking' : null);
  const allGuidance = guidanceData?.guidance || [];

  const isOutdoorHazardous = outdoorPm25 > 90;

  // Filter approved guidance actions according to user answers
  const filteredActions = allGuidance.filter((item) => {
    if (!cookingNow && item.scenario === 'cooking') return false;
    const hoodPrereq = item.preconditions || item.prerequisites || [];
    if (!ventedHood && hoodPrereq.some((p) => p.toLowerCase().includes('hood'))) return false;
    if (isOutdoorHazardous && item.mechanism === 'exhaust_ventilation' && item.action.toLowerCase().includes('window')) {
      return false;
    }
    return true;
  });

  const rooms = [
    { id: 'living', label: 'Living Room', icon: '🛋' },
    { id: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { id: 'bedroom', label: 'Bedroom', icon: '🛏' },
    { id: 'balcony', label: 'Balcony / Window', icon: '🪟' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-cyber-teal/20 flex items-center justify-center text-cyber-teal">
            <Home className="w-5 h-5 flex-shrink-0" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-display">
              Indoor Air Safety Protocols
            </h3>
            <span className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
              EPA & WHO source-control and ventilation protocols
            </span>
          </div>
        </div>
        <span className="text-[10px] bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white px-3 py-1 rounded-full font-bold border border-slate-300 dark:border-white/15">
          No-Purchase First
        </span>
      </div>

      {/* Room Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => setSelectedRoom(room.id)}
            className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold border transition cursor-pointer flex-shrink-0 ${
              selectedRoom === room.id
                ? 'bg-cyber-teal text-slate-950 border-cyber-teal shadow-cyber-glow-teal'
                : 'bg-slate-100 dark:bg-white/5 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
            }`}
          >
            <span>{room.icon}</span>
            <span>{room.label}</span>
          </button>
        ))}
      </div>

      {/* CO Alarm Emergency Override */}
      {coAlarmTriggered ? (
        <div
          role="alert"
          className="p-5 bg-rose-600 text-white rounded-3xl space-y-3 animate-pulse shadow-2xl"
        >
          <div className="flex items-center gap-2.5">
            <AlertOctagon className="w-6 h-6 text-white flex-shrink-0" />
            <h4 className="font-extrabold text-sm uppercase tracking-wide font-display">
              EMERGENCY: Carbon Monoxide Alarm Activated!
            </h4>
          </div>
          <p className="text-xs text-rose-100 leading-relaxed font-semibold">
            Carbon monoxide is invisible, odorless, and immediately dangerous to life. Evacuate all occupants and pets into fresh outdoor air immediately.
          </p>
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
            <a
              href="tel:112"
              className="bg-white text-rose-700 px-4 py-2 rounded-xl hover:bg-rose-50 transition shadow-xs"
            >
              Dial 112 / 911 Immediately
            </a>
            <button
              type="button"
              onClick={() => setCoAlarmTriggered(false)}
              className="bg-rose-700 hover:bg-rose-800 text-white px-3 py-2 rounded-xl transition cursor-pointer"
            >
              Dismiss Test
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
          <span className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
            Testing your home safety escalation flow?
          </span>
          <button
            type="button"
            onClick={() => setCoAlarmTriggered(true)}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-500/30 transition cursor-pointer"
          >
            Test CO Alarm Trigger
          </button>
        </div>
      )}

      {/* Household Factor Toggles */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-cyber-text-secondary block">
          Current Household Context
        </span>
        <div className="grid gap-2.5 sm:grid-cols-3">
          <label
            onClick={() => setCookingNow(!cookingNow)}
            className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition ${
              cookingNow
                ? 'bg-slate-100 dark:bg-white/15 border-cyber-teal shadow-xs font-bold text-slate-900 dark:text-white'
                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-cyber-text-secondary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-cyber-amber" />
              <span>Active Cooking</span>
            </div>
            <input type="checkbox" checked={cookingNow} readOnly className="sr-only" />
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                cookingNow ? 'bg-cyber-teal border-cyber-teal text-slate-950 font-bold' : 'border-slate-300 dark:border-white/20'
              }`}
            >
              {cookingNow && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </label>

          <label
            onClick={() => setVentedHood(!ventedHood)}
            className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition ${
              ventedHood
                ? 'bg-slate-100 dark:bg-white/15 border-cyber-teal shadow-xs font-bold text-slate-900 dark:text-white'
                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-cyber-text-secondary'
            }`}
          >
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-cyber-teal" />
              <span>Vented Exhaust</span>
            </div>
            <input type="checkbox" checked={ventedHood} readOnly className="sr-only" />
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                ventedHood ? 'bg-cyber-teal border-cyber-teal text-slate-950 font-bold' : 'border-slate-300 dark:border-white/20'
              }`}
            >
              {ventedHood && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </label>

          <label
            onClick={() => setBurningSensors(!burningSensors)}
            className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between cursor-pointer transition ${
              burningSensors
                ? 'bg-slate-100 dark:bg-white/15 border-cyber-amber shadow-xs font-bold text-slate-900 dark:text-white'
                : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-cyber-text-secondary'
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-cyber-amber" />
              <span>Incense / Candles</span>
            </div>
            <input type="checkbox" checked={burningSensors} readOnly className="sr-only" />
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                burningSensors ? 'bg-cyber-amber border-cyber-amber text-slate-950 font-bold' : 'border-slate-300 dark:border-white/20'
              }`}
            >
              {burningSensors && <CheckCircle2 className="w-3.5 h-3.5" />}
            </div>
          </label>
        </div>
      </div>

      {/* Hazardous Outdoor Warning if applicable */}
      {isOutdoorHazardous && (
        <div className="p-3.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center gap-2 text-xs text-slate-900 dark:text-white">
          <AlertTriangle className="w-4 h-4 text-cyber-amber flex-shrink-0" />
          <span>
            Outdoor PM₂.₅ is currently high ({Math.round(outdoorPm25)} μg/m³). Outdoor window ventilation is suppressed to prevent ambient infiltration.
          </span>
        </div>
      )}

      {/* Filtered Guidance Action Cards */}
      <div className="space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-cyber-text-secondary block">
          Recommended Interventions ({filteredActions.length})
        </span>

        {isLoading ? (
          <div className="p-4 text-center text-xs text-slate-600 dark:text-cyber-text-secondary">
            Loading reviewed indoor guidelines...
          </div>
        ) : filteredActions.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-center text-xs text-slate-600 dark:text-cyber-text-secondary border border-slate-200 dark:border-white/10">
            No specific indoor interventions required for current conditions.
          </div>
        ) : (
          filteredActions.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1.5 shadow-xs transition hover:border-cyber-teal/30"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{item.action}</span>
                <span className="text-[10px] bg-slate-200 dark:bg-white/10 px-2.5 py-0.5 rounded-full border border-slate-300 dark:border-white/15 font-semibold text-slate-700 dark:text-slate-300 uppercase">
                  {item.mechanism?.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">{item.rationale}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
