import React, { useState } from 'react';
import { Clock, Table, BarChart2 } from 'lucide-react';

function getPm25Category(value) {
  if (value == null) return { label: 'Unavailable', color: 'bg-white/10 text-slate-500' };
  if (value <= 30) return { label: 'Good', color: 'bg-cyber-teal/20 text-cyber-teal border-cyber-teal/40' };
  if (value <= 60) return { label: 'Satisfactory', color: 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' };
  if (value <= 90) return { label: 'Moderate', color: 'bg-cyber-amber/20 text-cyber-amber border-cyber-amber/40' };
  if (value <= 120) return { label: 'Poor', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' };
  if (value <= 250) return { label: 'Very Poor', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' };
  return { label: 'Severe', color: 'bg-purple-500/20 text-purple-400 border-purple-500/40' };
}

export function PollutantTimeline({ records = [], attribution = 'CAMS Forecast Model' }) {
  const [viewMode, setViewMode] = useState('strip'); // 'strip' | 'table'

  const forecastPoints = records
    .filter((r) => r.recordKind === 'forecast' && r.pollutant === 'PM2.5')
    .slice(0, 8);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-display">
            <Clock className="w-3.5 h-3.5 text-cyber-teal" />
            <span>Today's Forecast Day-Strip (PM₂.₅ Trend)</span>
          </div>
          <span className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
            Copernicus Atmosphere Monitoring Service (CAMS) • Regional spatial grid
          </span>
        </div>

        {/* View toggle for accessibility (Day-Strip visual cards vs Accessible Table) */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/10 text-xs shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode('strip')}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
              viewMode === 'strip'
                ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal'
                : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
            }`}
            aria-pressed={viewMode === 'strip'}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Day-Strip</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl font-bold transition cursor-pointer ${
              viewMode === 'table'
                ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal'
                : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
            }`}
            aria-pressed={viewMode === 'table'}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table View</span>
          </button>
        </div>
      </div>

      {viewMode === 'strip' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 overflow-x-auto pb-1">
          {forecastPoints.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-slate-500 dark:text-cyber-text-secondary">
              No hourly CAMS forecast points available for this period.
            </div>
          ) : (
            forecastPoints.map((point, index) => {
              const date = new Date(point.timestamp);
              const hourLabel = date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
              const { label, color } = getPm25Category(point.value);

              return (
                <div
                  key={index}
                  className="p-3 bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-between text-center space-y-1.5 shadow-xs hover:border-cyber-teal/30 transition"
                >
                  <span className="text-[11px] font-bold text-slate-600 dark:text-cyber-text-secondary">{hourLabel}</span>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
                    {Math.round(point.value)}
                  </div>
                  <span className="text-[9px] text-slate-400 dark:text-cyber-text-muted font-medium">μg/m³</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-xs ${color}`}
                  >
                    {label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white/5 shadow-xs">
          <table className="w-full text-left text-xs text-slate-900 dark:text-white">
            <caption className="sr-only">Hourly PM2.5 Forecast Data Table</caption>
            <thead className="bg-white/10 text-slate-600 dark:text-cyber-text-secondary text-[10px] uppercase font-bold border-b border-slate-200 dark:border-white/10">
              <tr>
                <th scope="col" className="px-3 py-2">Time (Hour)</th>
                <th scope="col" className="px-3 py-2">PM₂.₅ Level</th>
                <th scope="col" className="px-3 py-2">Unit</th>
                <th scope="col" className="px-3 py-2">Category</th>
                <th scope="col" className="px-3 py-2">Data Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/10">
              {forecastPoints.map((point, index) => {
                const hourLabel = new Date(point.timestamp).toLocaleTimeString([], {
                  hour: 'numeric',
                  hour12: true
                });
                const { label } = getPm25Category(point.value);

                return (
                  <tr key={index} className="hover:bg-white/5">
                    <td className="px-3 py-2 font-semibold">{hourLabel}</td>
                    <td className="px-3 py-2 font-bold">{Math.round(point.value)}</td>
                    <td className="px-3 py-2 text-slate-500 dark:text-cyber-text-secondary">μg/m³</td>
                    <td className="px-3 py-2">
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-semibold border border-white/15">
                        {label}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-[10px] text-slate-500 dark:text-cyber-text-secondary">Copernicus CAMS</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
