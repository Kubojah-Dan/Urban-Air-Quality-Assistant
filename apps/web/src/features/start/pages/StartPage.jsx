import React, { useState } from 'react';
import { DecisionEntry } from '../components/DecisionEntry.jsx';
import { PlacePicker } from '../../location/components/PlacePicker.jsx';
import { ShieldCheck, ArrowRight, Clock, Navigation } from 'lucide-react';

export function StartPage({ onStartPlan }) {
  const [selectedTask, setSelectedTask] = useState('commute');
  const [selectedCity, setSelectedCity] = useState({
    countryCode: 'IN',
    cityId: 'delhi',
    displayName: 'Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timeZone: 'Asia/Kolkata'
  });

  // Short Context Form fields
  const [departureTime, setDepartureTime] = useState('08:00');
  const [deadlineTime, setDeadlineTime] = useState('09:00');
  const [transitFeasible, setTransitFeasible] = useState(true);
  const [hasVentedHood, setHasVentedHood] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStartPlan({
      task: selectedTask,
      city: selectedCity,
      initialContext: {
        departureTime,
        deadlineTime,
        transitFeasible,
        hasVentedHood
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      {/* Hero Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold mb-3">
          <span>Constraint-Aware Air Quality Assistant</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
          What cleaner-air decision are you making today?
        </h1>
        <p className="text-stone-600 mt-2 text-sm leading-relaxed">
          DayShift compares your usual routine against one feasible change and a practical backup plan.
          All impact numbers are verified; no generic AI advice or unmeasured health claims.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: City Selection */}
        <div className="bg-white p-5 border border-stone-200 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="city-select" className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Step 1: Select Your Urban Area
            </label>
            <span className="text-[11px] text-stone-500">Coarse area planning</span>
          </div>
          <PlacePicker selectedCity={selectedCity} onSelectCity={setSelectedCity} />
        </div>

        {/* Step 2: Goal / Decision Selection */}
        <div className="bg-white p-5 border border-stone-200 rounded-2xl shadow-xs space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
            Step 2: Choose Your Primary Focus
          </label>
          <DecisionEntry selectedTask={selectedTask} onSelectTask={setSelectedTask} />
        </div>

        {/* Step 3: Quick Routine Context Form */}
        <div className="bg-white p-5 border border-stone-200 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
              Step 3: Quick Routine Context
            </label>
            <span className="text-[11px] text-stone-400">Minimal required details</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start-departure" className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                Usual Departure Time
              </label>
              <input
                id="start-departure"
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>

            <div>
              <label htmlFor="start-deadline" className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-stone-500" />
                Must Arrive By (Hard Deadline)
              </label>
              <input
                id="start-deadline"
                type="time"
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row gap-4">
            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={transitFeasible}
                onChange={(e) => setTransitFeasible(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300"
              />
              <span>Public transit (metro/bus) is available for this trip</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={hasVentedHood}
                onChange={(e) => setHasVentedHood(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300"
              />
              <span>Home has outdoor-vented cooking hood</span>
            </label>
          </div>
        </div>

        {/* Action Button & Privacy Footer */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition shadow-sm flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 cursor-pointer"
          >
            <span>Generate Today’s Decision Board</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-xs text-stone-500 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Privacy Note: No account or browser GPS required. Coarse routine data stored in session only.</span>
          </div>
        </div>
      </form>
    </div>
  );
}
