import React, { useState } from 'react';

export function RoutineInputForm({ onSubmit, isLoading }) {
  const [activityName, setActivityName] = useState('Morning Work Commute');
  const [deadline, setDeadline] = useState('09:00');
  const [transitAvailable, setTransitAvailable] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: `base_${Date.now()}`,
      activities: [
        {
          id: 'act_1',
          name: activityName,
          type: 'commute',
          startWindow: '08:00',
          endWindow: deadline,
          mode: 'transit'
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
          id: 'con_transit',
          type: 'hard',
          description: 'Transit availability',
          parameter: 'transitUnavailable',
          value: !transitAvailable
        }
      ]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-5 border border-stone-200 rounded-xl space-y-4">
      <h3 className="font-semibold text-stone-900 text-sm">Describe Your Routine & Hard Constraints</h3>
      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1">Activity / Trip</label>
        <input
          type="text"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2.5 text-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Fixed Arrival Deadline</label>
          <input
            type="time"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-sm"
          />
        </div>
        <div className="flex items-center pt-5">
          <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
            <input
              type="checkbox"
              checked={transitAvailable}
              onChange={(e) => setTransitAvailable(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            Public transit is feasible
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2.5 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition disabled:opacity-50"
      >
        {isLoading ? 'Computing Feasible Plan...' : 'Generate 3-Way Decision Board'}
      </button>
    </form>
  );
}
