import React from 'react';
import { DataQualityBadge } from './DataQualityBadge.jsx';
import { Radio, CloudSun, AlertTriangle } from 'lucide-react';

export function AirEvidenceHeader({ bundle, location }) {
  const records = bundle?.records || [];
  const observationRecord = records.find((r) => r.recordKind === 'observation');
  const forecastRecord = records.find((r) => r.recordKind === 'forecast' && r.pollutant === 'PM2.5') || records.find((r) => r.recordKind === 'forecast');

  const isIndia = location?.countryCode === 'IN';
  const isUS = location?.countryCode === 'US';

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
      {/* Top Location & Quality Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
            Location Evidence
          </span>
          <h2 className="text-lg font-bold text-stone-900">{location?.displayName || 'Active City'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <DataQualityBadge status={bundle?.freshnessState || 'valid'} />
        </div>
      </div>

      {/* Two-Column Provenance Cards: Station Observation vs Forecast Model */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Card 1: Ground Station Observation */}
        <div className="p-4 rounded-lg border border-stone-200 bg-stone-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-stone-500" />
              Ground / Reporting Station
            </span>
            {observationRecord?.qualityFlags?.includes('preliminary') && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                Preliminary Data
              </span>
            )}
          </div>

          {observationRecord ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-stone-900">
                  {Math.round(observationRecord.value)}
                </span>
                <span className="text-xs font-medium text-stone-600">
                  {observationRecord.unit} ({observationRecord.pollutant})
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">{observationRecord.coverage}</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Observed: {new Date(observationRecord.validAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {observationRecord.attribution}
              </p>
            </div>
          ) : (
            <div className="py-2 text-xs text-stone-500 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-stone-700 block">
                  {isIndia
                    ? 'No CPCB ground station reporting'
                    : isUS
                      ? 'No AirNow station reporting'
                      : 'No station sensor in range'}
                </span>
                <span className="text-[11px] text-stone-500">
                  {isIndia
                    ? 'CPCB ground observation endpoint not configured or no reporting sensor. Showing regional CAMS forecast model as honest alternative.'
                    : 'Displaying numerical model forecast without fabricating sensor data.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Numerical Model Forecast (CAMS) */}
        <div className="p-4 rounded-lg border border-stone-200 bg-stone-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5 text-blue-600" />
              Numerical Forecast Model
            </span>
            <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded font-medium">
              Forecast Model
            </span>
          </div>

          {forecastRecord ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-stone-900">
                  {Math.round(forecastRecord.value)}
                </span>
                <span className="text-xs font-medium text-stone-600">
                  {forecastRecord.unit} ({forecastRecord.pollutant})
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">{forecastRecord.coverage}</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Model: {forecastRecord.modelId} • {forecastRecord.attribution}
              </p>
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-2">Forecast model data unavailable.</p>
          )}
        </div>
      </div>
    </div>
  );
}
