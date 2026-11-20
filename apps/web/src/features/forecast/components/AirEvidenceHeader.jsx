import React from 'react';
import { DataQualityBadge } from './DataQualityBadge.jsx';

export function AirEvidenceHeader({ bundle, location }) {
  const primaryRecord = bundle?.records?.[0];
  const value = primaryRecord ? Math.round(primaryRecord.value) : '--';
  const unit = primaryRecord?.unit || 'µg/m³';
  const pollutant = primaryRecord?.pollutant || 'PM2.5';
  const source = primaryRecord?.attribution || 'CAMS / Open-Meteo';

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {location?.displayName || 'Active City'}
          </span>
          <DataQualityBadge status={bundle?.freshnessState || 'valid'} />
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-stone-900">{value}</span>
          <span className="text-sm font-medium text-stone-500">
            {unit} ({pollutant})
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-1">Source: {source}</p>
      </div>
    </div>
  );
}
