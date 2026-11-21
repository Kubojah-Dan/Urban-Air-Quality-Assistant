import React, { useState } from 'react';
import { Clock, Table, BarChart2 } from 'lucide-react';

function getPm25Category(value) {
  if (value == null) return { label: 'Unavailable', color: 'bg-stone-100 text-stone-600' };
  if (value <= 30) return { label: 'Good', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  if (value <= 60) return { label: 'Satisfactory', color: 'bg-teal-50 text-teal-700 border-teal-200' };
  if (value <= 90) return { label: 'Moderate', color: 'bg-amber-50 text-amber-700 border-amber-200' };
  if (value <= 120) return { label: 'Poor', color: 'bg-orange-50 text-orange-700 border-orange-200' };
  if (value <= 250) return { label: 'Very Poor', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  return { label: 'Severe', color: 'bg-purple-50 text-purple-700 border-purple-200' };
}

export function PollutantTimeline({ records = [], attribution = 'CAMS Forecast Model' }) {
  const [viewMode, setViewMode] = useState('strip'); // 'strip' | 'table'

  // Extract hourly forecast records for PM2.5
  const forecastPoints = records
    .filter((r) => r.recordKind === 'forecast' && r.pollutant === 'PM2.5')
    .slice(0, 8);

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-stone-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Today's Forecast Day-Strip (PM₂.₅ Trend)</span>
          </div>
          <span className="text-[11px] text-stone-400">
            Copernicus Atmosphere Monitoring Service (CAMS) • Spatial grid resolution
          </span>
        </div>

        {/* View toggle for accessibility (Day-Strip visual cards vs Accessible Table) */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-stone-100 p-0.5 rounded-lg text-xs">
          <button
            type="button"
            onClick={() => setViewMode('strip')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
              viewMode === 'strip' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
            aria-pressed={viewMode === 'strip'}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Day-Strip</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
              viewMode === 'table' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
            aria-pressed={viewMode === 'table'}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Table Alternative</span>
          </button>
        </div>
      </div>

      {forecastPoints.length === 0 ? (
        <div className="py-6 text-center text-xs text-stone-500">
          Awaiting regional hourly forecast points from {attribution}...
        </div>
      ) : viewMode === 'strip' ? (
        /* Visual Day-Strip */
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {forecastPoints.map((point) => {
            const timeStr = new Date(point.validAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            });
            const cat = getPm25Category(point.value);
            return (
              <div
                key={point.id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700">{timeStr}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md border font-medium ${cat.color}`}>
                    {cat.label}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-lg font-extrabold text-stone-900">
                    {Math.round(point.value)}
                  </span>
                  <span className="text-[11px] text-stone-500 ml-1">µg/m³</span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">Forecast Window</span>
              </div>
            );
          })}
        </div>
      ) : (
        /* Accessible Table Alternative */
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-left text-xs text-stone-700 border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase">
                <th scope="col" className="py-2 pr-3 font-semibold">Forecast Valid Time</th>
                <th scope="col" className="py-2 px-3 font-semibold">Pollutant</th>
                <th scope="col" className="py-2 px-3 font-semibold">Predicted Value</th>
                <th scope="col" className="py-2 px-3 font-semibold">Air Quality Category</th>
                <th scope="col" className="py-2 pl-3 font-semibold">Provenance Model</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {forecastPoints.map((point) => {
                const timeStr = new Date(point.validAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                });
                const cat = getPm25Category(point.value);
                return (
                  <tr key={point.id} className="hover:bg-stone-50/50">
                    <td className="py-2 pr-3 font-medium text-stone-900">{timeStr}</td>
                    <td className="py-2 px-3">{point.pollutant}</td>
                    <td className="py-2 px-3 font-semibold">{Math.round(point.value)} {point.unit}</td>
                    <td className="py-2 px-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${cat.color}`}>
                        {cat.label}
                      </span>
                    </td>
                    <td className="py-2 pl-3 text-stone-500">{point.modelId || 'CAMS'}</td>
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
