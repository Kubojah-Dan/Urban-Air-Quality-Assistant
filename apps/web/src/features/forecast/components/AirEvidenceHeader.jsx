import React from 'react';
import { DataQualityBadge } from './DataQualityBadge.jsx';
import { StatusLabel } from '../../shared/components/StatusLabel.jsx';
import { Radio, CloudSun, AlertTriangle, ShieldCheck } from 'lucide-react';

export function AirEvidenceHeader({ bundle, location }) {
  const records = bundle?.records || [];
  const observationRecord = records.find((r) => r.recordKind === 'observation');
  const forecastRecord =
    records.find((r) => r.recordKind === 'forecast' && r.pollutant === 'PM2.5') ||
    records.find((r) => r.recordKind === 'forecast');

  const isIndia = location?.countryCode === 'IN';
  const isUS = location?.countryCode === 'US';

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-5 space-y-4">
      {/* Top Location & Quality Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block">
            Location Evidence & Provenance
          </span>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            {location?.displayName || 'Active Urban Area'}
          </h2>
          <span className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Manual area selection • No continuous GPS tracking
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DataQualityBadge status={bundle?.freshnessState || 'valid'} />
          {observationRecord ? (
            <StatusLabel status="observation" label="Station Active" />
          ) : (
            <StatusLabel status="no_coverage" label="No Local Sensor" />
          )}
        </div>
      </div>

      {/* Two-Column Provenance Cards: Station Observation vs Forecast Model */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Card 1: Ground Station Observation */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-indigo-600" />
              Ground Station Observation
            </span>
            {observationRecord?.qualityFlags?.includes('preliminary') && (
              <StatusLabel status="preliminary" label="Preliminary" />
            )}
          </div>

          {observationRecord ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-stone-900">
                  {Math.round(observationRecord.value)}
                </span>
                <span className="text-xs font-semibold text-stone-600">
                  {observationRecord.unit} ({observationRecord.pollutant})
                </span>
              </div>
              <p className="text-xs text-stone-700 font-medium">{observationRecord.coverage}</p>
              <div className="text-[11px] text-stone-500 space-y-0.5 pt-1 border-t border-stone-200/50">
                <p>Observed: {new Date(observationRecord.validAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                <p>Source: {observationRecord.attribution}</p>
              </div>
            </div>
          ) : (
            <div className="py-2 text-xs text-stone-600 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-800 block">
                  {isIndia
                    ? 'No CPCB ground station reporting nearby'
                    : isUS
                      ? 'No AirNow reporting station in area'
                      : 'No ground station in range'}
                </span>
                <span className="text-[11px] text-stone-500 leading-relaxed block mt-0.5">
                  {isIndia
                    ? 'CPCB station coverage is uneven. Displaying regional CAMS global numerical forecast (~45 km grid) without inventing synthetic ground sensor readings.'
                    : 'Showing regional numerical model forecast as honest alternative.'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Numerical Model Forecast (CAMS) */}
        <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <CloudSun className="w-4 h-4 text-blue-600" />
              Numerical Forecast Model
            </span>
            <StatusLabel status="model_forecast" label="CAMS Forecast" />
          </div>

          {forecastRecord ? (
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-stone-900">
                  {Math.round(forecastRecord.value)}
                </span>
                <span className="text-xs font-semibold text-stone-600">
                  {forecastRecord.unit} ({forecastRecord.pollutant})
                </span>
              </div>
              <p className="text-xs text-stone-700 font-medium">{forecastRecord.coverage}</p>
              <div className="text-[11px] text-stone-500 space-y-0.5 pt-1 border-t border-stone-200/50">
                <p>Valid Time: {new Date(forecastRecord.validAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                <p>Retrieved: {new Date(forecastRecord.retrievedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {forecastRecord.attribution}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-3">Forecast model data temporarily unavailable.</p>
          )}
        </div>
      </div>
    </div>
  );
}
