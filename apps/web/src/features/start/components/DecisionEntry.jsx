import React from 'react';
import { Compass, Clock, Home, CheckCircle2 } from 'lucide-react';

export function DecisionEntry({ selectedTask, onSelectTask }) {
  const decisions = [
    {
      id: 'commute',
      title: 'Plan a Commute or Trip',
      desc: 'Find cleaner departure timing and transit trade-offs without arriving late.',
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
    <div className="grid gap-3.5 sm:grid-cols-3" role="radiogroup" aria-label="Cleaner-air decision options">
      {decisions.map((d) => {
        const Icon = d.icon;
        const isSelected = selectedTask === d.id;
        return (
          <button
            key={d.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelectTask(d.id)}
            className={`relative flex flex-col text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              isSelected
                ? 'border-brand-600 bg-brand-50/40 ring-1 ring-brand-600 shadow-xs'
                : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
            }`}
          >
            {isSelected && (
              <CheckCircle2 className="absolute top-4 right-4 w-4 h-4 text-brand-600" />
            )}
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                isSelected ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-700'
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm">{d.title}</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">{d.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
