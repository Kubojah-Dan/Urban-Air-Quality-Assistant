import React from 'react';
import { Compass, Clock, Home } from 'lucide-react';

export function DecisionEntry({ onSelectTask }) {
  const decisions = [
    {
      id: 'commute',
      title: 'Plan a Commute or Trip',
      desc: 'Find cleaner departure timing and mode trade-offs without arriving late.',
      icon: Compass
    },
    {
      id: 'outdoor',
      title: 'Choose Outdoor Time',
      desc: 'Pick the least polluted window for outdoor exercise, walking, or errands.',
      icon: Clock
    },
    {
      id: 'indoor',
      title: 'Improve Indoor Air',
      desc: 'Actionable, no-purchase-first steps to manage indoor cooking smoke and pollutants.',
      icon: Home
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {decisions.map((d) => {
        const Icon = d.icon;
        return (
          <button
            key={d.id}
            onClick={() => onSelectTask(d.id)}
            className="flex flex-col text-left p-5 bg-white border border-stone-200 rounded-xl hover:border-brand-500 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-stone-900">{d.title}</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">{d.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
