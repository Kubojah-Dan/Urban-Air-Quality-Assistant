import React, { useState } from 'react';
import { Home, ShieldAlert, Wind, CheckCircle2, AlertTriangle, Flame, AlertOctagon } from 'lucide-react';
import { useIndoorGuidance } from '../hooks/useIndoorGuidance.js';

export function IndoorActionCoach({ outdoorPm25 = 80 }) {
  // Context questions
  const [cookingNow, setCookingNow] = useState(false);
  const [ventedHood, setVentedHood] = useState(true);
  const [burningSensors, setBurningSensors] = useState(false);
  const [coAlarmTriggered, setCoAlarmTriggered] = useState(false);

  const { data: guidanceData, isLoading } = useIndoorGuidance(cookingNow ? 'cooking' : null);
  const allGuidance = guidanceData?.guidance || [];

  const isOutdoorHazardous = outdoorPm25 > 90;

  // Filter approved guidance actions according to user answers
  const filteredActions = allGuidance.filter((item) => {
    // If not cooking, omit cooking-specific actions
    if (!cookingNow && item.scenario === 'cooking') return false;
    // If user lacks vented hood, omit actions requiring it
    const hoodPrereq = item.preconditions || item.prerequisites || [];
    if (!ventedHood && hoodPrereq.some((p) => p.toLowerCase().includes('hood'))) return false;
    // If outdoor air is hazardous, omit window ventilation actions
    if (isOutdoorHazardous && item.mechanism === 'exhaust_ventilation' && item.action.toLowerCase().includes('window')) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white p-5 border border-stone-200 rounded-2xl shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Home className="w-5 h-5 text-brand-600 flex-shrink-0" />
          <h3 className="font-bold text-stone-900 text-sm">Reviewed Indoor Air Coach</h3>
        </div>
        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
          No-Purchase First
        </span>
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        Guidance selected strictly from reviewed EPA/WHO source-control and ventilation protocols.
        No sensor hacks or fabricated indoor measurements.
      </p>

      {/* CO Alarm Emergency Override */}
      {coAlarmTriggered ? (
        <div
          role="alert"
          className="p-4 bg-rose-600 text-white rounded-xl space-y-2 animate-pulse"
        >
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-white flex-shrink-0" />
            <h4 className="font-extrabold text-sm uppercase tracking-wide">
              EMERGENCY: Carbon Monoxide Alarm Activated!
            </h4>
          </div>
          <p className="text-xs text-rose-100 leading-relaxed font-medium">
            EVACUATE IMMEDIATELY to fresh outdoor air. Do NOT delay for air quality planning. Call emergency
            services (112 / 911) from outside. Do not re-enter until emergency responders clear the home.
          </p>
          <button
            type="button"
            onClick={() => setCoAlarmTriggered(false)}
            className="text-[11px] underline text-rose-200 hover:text-white pt-1 block cursor-pointer"
          >
            Clear emergency test state
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs">
          <span className="text-stone-700 flex items-center gap-1.5 font-medium">
            <ShieldAlert className="w-4 h-4 text-stone-400" />
            Carbon Monoxide Alarm active?
          </span>
          <button
            type="button"
            onClick={() => setCoAlarmTriggered(true)}
            className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
          >
            Simulate CO Alarm Trigger
          </button>
        </div>
      )}

      {/* Context Questions */}
      <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2.5 text-xs">
        <span className="font-bold uppercase tracking-wider text-stone-600 text-[10px] block">
          Current Household Context Questions
        </span>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-stone-700 font-medium">Cooking in progress right now?</span>
          <input
            type="checkbox"
            checked={cookingNow}
            onChange={(e) => setCookingNow(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-stone-700 font-medium">Kitchen has outdoor-venting exhaust hood?</span>
          <input
            type="checkbox"
            checked={ventedHood}
            onChange={(e) => setVentedHood(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-stone-700 font-medium">Burning incense, mosquito coils, or candles?</span>
          <input
            type="checkbox"
            checked={burningSensors}
            onChange={(e) => setBurningSensors(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300"
          />
        </label>
      </div>

      {/* Active Guidance Actions */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
          Recommended Approved Actions ({filteredActions.length})
        </span>

        {isLoading ? (
          <p className="text-xs text-stone-500 py-3">Loading reviewed indoor guidelines...</p>
        ) : (
          filteredActions.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-white border border-stone-200 rounded-xl space-y-1.5 shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-stone-900 text-xs block">{item.action}</span>
                <span className="text-[10px] font-semibold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-full uppercase flex-shrink-0">
                  {item.mechanism?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">{item.description}</p>
              {item.avoidWhen?.length > 0 && (
                <div className="flex items-center gap-1 text-[10px] text-amber-700 pt-1">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span><strong>Avoid:</strong> {item.avoidWhen.join(', ')}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
