import React, { useState, useEffect } from 'react';
import { Clock, Navigation, Bus, RefreshCw, Sliders } from 'lucide-react';

export function RoutineInputForm({ initialValues, onSubmit, isLoading }) {
  const [activityName, setActivityName] = useState(initialValues?.activityName || 'Morning Work Commute');
  const [departureTime, setDepartureTime] = useState(initialValues?.departureTime || '08:00');
  const [deadline, setDeadline] = useState(initialValues?.deadlineTime || '09:00');
  const [transitAvailable, setTransitAvailable] = useState(
    initialValues?.transitFeasible !== undefined ? initialValues.transitFeasible : true
  );
  const [mode, setMode] = useState('drive');

  useEffect(() => {
    if (initialValues) {
      if (initialValues.departureTime) setDepartureTime(initialValues.departureTime);
      if (initialValues.deadlineTime) setDeadline(initialValues.deadlineTime);
      if (initialValues.transitFeasible !== undefined) setTransitAvailable(initialValues.transitFeasible);
    }
  }, [initialValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: `base_${Date.now()}`,
      activityType: 'commute',
      activities: [
        {
          id: 'act_1',
          name: activityName,
          type: 'commute',
          startWindow: departureTime,
          endWindow: deadline,
          mode
        }
      ],
      constraints: [
        {
          id: 'con_arrival',
          type: 'hard',
          description: `Must arrive by ${deadline}`,
          parameter: 'mustArriveBy',
          value: deadline
        },
        {
          id: 'con_leave',
          type: 'hard',
          description: `Cannot leave earlier than ${departureTime}`,
          parameter: 'cannotLeaveEarlier',
          value: departureTime
        },
        {
          id: 'con_transit',
          type: 'hard',
          description: transitAvailable ? 'Transit is available' : 'Transit is unavailable',
          parameter: 'transitUnavailable',
          value: !transitAvailable
        }
      ]
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-5 border border-stone-200 rounded-2xl shadow-xs space-y-4"
    >
      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
        <div className="flex items-center gap-1.5 font-bold text-stone-900 text-sm">
          <Sliders className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <span>Trip Details & Constraints</span>
        </div>
        <span className="text-[10px] text-stone-400">Coarse Schedule</span>
      </div>

      <div>
        <label htmlFor="routine-name" className="block text-xs font-semibold text-stone-700 mb-1">
          Activity / Commute Label
        </label>
        <input
          id="routine-name"
          type="text"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="routine-departure" className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            Usual Departure
          </label>
          <input
            id="routine-departure"
            type="time"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>

        <div>
          <label htmlFor="routine-deadline" className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-stone-500" />
            Arrival Deadline
          </label>
          <input
            id="routine-deadline"
            type="time"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="routine-mode" className="block text-xs font-semibold text-stone-700 mb-1">
          Usual Travel Mode
        </label>
        <select
          id="routine-mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="drive">Personal Car (Gasoline / Diesel)</option>
          <option value="motorcycle">Two-Wheeler / Scooter</option>
          <option value="transit">Metro / Bus Transit</option>
          <option value="walk">Walking</option>
        </select>
      </div>

      <div className="pt-1">
        <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
          <input
            type="checkbox"
            checked={transitAvailable}
            onChange={(e) => setTransitAvailable(e.target.checked)}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300"
          />
          <span className="flex items-center gap-1">
            <Bus className="w-3.5 h-3.5 text-stone-500" />
            Public transit alternative is accessible
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Calculating Real-Air Plan...</span>
          </>
        ) : (
          <span>Update Decision Board</span>
        )}
      </button>
    </form>
  );
}
