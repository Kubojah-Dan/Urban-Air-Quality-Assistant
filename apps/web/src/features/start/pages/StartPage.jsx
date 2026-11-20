import React from 'react';
import { DecisionEntry } from '../components/DecisionEntry.jsx';
import { PlacePicker } from '../../location/components/PlacePicker.jsx';

export function StartPage({ onStartPlan }) {
  const [selectedTask, setSelectedTask] = React.useState('commute');
  const [selectedCity, setSelectedCity] = React.useState({
    countryCode: 'IN',
    cityId: 'delhi',
    displayName: 'Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          What cleaner-air decision are you making today?
        </h1>
        <p className="text-stone-600 mt-2 text-sm max-w-2xl">
          DayShift helps you make one feasible adjustment to your daily routine based on official air
          forecasts and real observations.
        </p>
      </div>

      <div className="bg-white p-5 border border-stone-200 rounded-xl space-y-4">
        <label className="block text-sm font-medium text-stone-700">1. Select your city or district</label>
        <PlacePicker selectedCity={selectedCity} onSelectCity={setSelectedCity} />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-stone-700">2. Choose your primary goal</label>
        <DecisionEntry onSelectTask={setSelectedTask} />
      </div>

      <div className="pt-2">
        <button
          onClick={() => onStartPlan({ task: selectedTask, city: selectedCity })}
          className="w-full sm:w-auto px-6 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
        >
          Continue to Today’s Decision Board →
        </button>
      </div>
    </div>
  );
}
