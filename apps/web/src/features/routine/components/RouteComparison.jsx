import React, { useState } from 'react';
import { Navigation, Clock, ShieldCheck, Car, Train, Bike, Compass, AlertCircle, Sparkles } from 'lucide-react';

export function RouteComparison({ selectedCity = 'Delhi, India' }) {
  const [selectedRouteId, setSelectedRouteId] = useState('route_metro');

  const routes = [
    {
      id: 'route_arterial',
      name: 'Route A: Direct Arterial Highway',
      mode: 'Car (Solo Drive)',
      modeIcon: Car,
      duration: '42 mins',
      distance: '16.5 km',
      co2Emissions: '2,970 g CO₂',
      co2Basis: '180g/km (ARAI 2024 petrol fleet avg)',
      exposureLevel: 'Elevated Roadside Plume',
      exposureDetail: 'Passes major signal intersections with idling diesel goods vehicles.',
      tag: 'Fastest Direct Route',
      tagColor: 'bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-300'
    },
    {
      id: 'route_secondary',
      name: 'Route B: Green Buffer / Residential Ring',
      mode: 'Car (Cabin Recirculation)',
      modeIcon: Car,
      duration: '48 mins',
      distance: '18.2 km',
      co2Emissions: '3,270 g CO₂',
      co2Basis: '180g/km (ARAI 2024 petrol fleet avg)',
      exposureLevel: 'Moderate Exposure',
      exposureDetail: 'Bypasses commercial truck corridors through tree-lined avenue sectors.',
      tag: 'Low Traffic Infiltration',
      tagColor: 'bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-cyber-blue'
    },
    {
      id: 'route_metro',
      name: 'Route C: Metro Transit + 5m Walk',
      mode: 'Electric Metro Rail',
      modeIcon: Train,
      duration: '38 mins',
      distance: '15.0 km',
      co2Emissions: '225 g CO₂',
      co2Basis: '15g/passenger-km (Indian Metro grid factor)',
      exposureLevel: 'Lowest Curb Exposure',
      exposureDetail: 'Filtered underground/elevated cars bypass curbside particulate plumes entirely.',
      tag: 'Recommended Clean Alternative',
      tagColor: 'bg-cyber-teal text-slate-950 font-black shadow-cyber-glow-teal'
    }
  ];

  return (
    <div className="cyber-card p-5 sm:p-6 rounded-[28px] space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyber-blue/20 text-cyber-blue">
              <Navigation className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-display">
              Air-Aware Route & Transit Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-0.5">
            Compare commute alternatives for {selectedCity.split(',')[0]} across travel time, emissions, and curbside exposure.
          </p>
        </div>

        <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-full text-slate-700 dark:text-cyber-text-secondary border border-slate-200 dark:border-white/10 self-start sm:self-auto font-bold">
          ARAI 2024 Factors
        </span>
      </div>

      {/* Routes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {routes.map((rt) => {
          const isSelected = selectedRouteId === rt.id;
          const Icon = rt.modeIcon;

          return (
            <div
              key={rt.id}
              onClick={() => setSelectedRouteId(rt.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-teal-500/10 dark:bg-cyber-teal/10 border-cyber-teal/60 ring-1 ring-cyber-teal/30 shadow-md'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${rt.tagColor}`}>
                    {rt.tag}
                  </span>
                  <Icon className="w-4 h-4 text-slate-600 dark:text-cyber-text-secondary" />
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
                    {rt.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
                    {rt.mode}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div className="p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5">
                    <span className="text-[10px] text-slate-500 dark:text-cyber-text-muted block">Duration</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{rt.duration}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5">
                    <span className="text-[10px] text-slate-500 dark:text-cyber-text-muted block">Distance</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">{rt.distance}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-cyber-text-secondary">Tailpipe CO₂:</span>
                    <span className="font-extrabold text-emerald-600 dark:text-cyber-teal font-mono">
                      {rt.co2Emissions}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 dark:text-cyber-text-muted block font-mono">
                    Factor: {rt.co2Basis}
                  </span>
                </div>

                <div className="text-[11px] space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    Exposure: {rt.exposureLevel}
                  </span>
                  <p className="text-[10px] text-slate-500 dark:text-cyber-text-secondary leading-snug">
                    {rt.exposureDetail}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className={`w-full py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-cyber-teal text-slate-950 font-black shadow-xs'
                    : 'bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-slate-300'
                }`}
              >
                {isSelected ? 'Selected Route' : 'Compare This Route'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Uncertainty & Resolution Disclosure */}
      <div className="p-3 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 text-[10px] text-slate-600 dark:text-cyber-text-secondary space-y-0.5">
        <p className="font-bold text-slate-800 dark:text-white">Spatial Resolution Transparency:</p>
        <p>
          Route comparisons evaluate ambient regional observations and documented vehicular emission rates. We do not claim precise street-level microclimate sensor accuracy where spatial sensor density is unavailable.
        </p>
      </div>
    </div>
  );
}
