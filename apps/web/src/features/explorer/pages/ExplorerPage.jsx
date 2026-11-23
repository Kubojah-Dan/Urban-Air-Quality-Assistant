import React, { useState, useEffect } from 'react';
import { PlacePicker } from '../../location/components/PlacePicker.jsx';
import { PollutantTimeline } from '../../forecast/components/PollutantTimeline.jsx';
import { useAirEvidence } from '../../forecast/hooks/useAirEvidence.js';
import { CircularAqiGauge } from '../../forecast/components/CircularAqiGauge.jsx';
import { UrbanAirMap } from '../../forecast/components/UrbanAirMap.jsx';
import { Wind, ShieldCheck, Database, Calendar, RefreshCw, AlertCircle, MapPin } from 'lucide-react';

export function ExplorerPage({ initialCity, onSelectCity }) {
  const [selectedCity, setSelectedCity] = useState(
    initialCity || {
      countryCode: 'IN',
      cityId: 'delhi',
      displayName: 'Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      timeZone: 'Asia/Kolkata'
    }
  );

  // Sync state when global city changes from TopBar or other components
  useEffect(() => {
    if (initialCity && initialCity.displayName !== selectedCity.displayName) {
      setSelectedCity(initialCity);
    }
  }, [initialCity]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    if (onSelectCity) {
      onSelectCity(city);
    }
  };

  const { data: evidenceBundle, isLoading, refetch } = useAirEvidence(selectedCity);

  const pm25Val =
    evidenceBundle?.records?.find((r) => r.pollutant === 'PM2.5')?.value || 18;
  const pm10Val =
    evidenceBundle?.records?.find((r) => r.pollutant === 'PM10')?.value || 38;
  const no2Val =
    evidenceBundle?.records?.find((r) => r.pollutant === 'NO2')?.value || 21;
  const o3Val =
    evidenceBundle?.records?.find((r) => r.pollutant === 'O3')?.value || 26;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display block">
            Regional Environmental Ingestion
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Air Quality Explorer
          </h1>
          <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-0.5">
            Transparent regional atmospheric observations, interactive dispersion maps, and CAMS forecast models.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white text-xs font-semibold border border-slate-300 dark:border-white/10 transition cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyber-teal' : ''}`} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh Feed'}</span>
        </button>
      </div>

      {/* Urban Area Selection Card */}
      <div className="cyber-card p-5 rounded-[28px] space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-cyber-text-muted block">
          Select Monitored Urban Area
        </label>
        <PlacePicker selectedCity={selectedCity} onSelectCity={handleCitySelect} />
      </div>

      {/* Interactive Urban Air & Station Dispersion Map */}
      <UrbanAirMap selectedCity={selectedCity} currentPm25={pm25Val} />

      {/* Top Grid: Circular Dial + Pollutant Cards */}
      <div className="grid gap-6 md:grid-cols-2 items-start">
        {/* Circular Gauge */}
        <CircularAqiGauge
          aqi={Math.round(pm25Val)}
          pollutant="PM 2.5"
          category={pm25Val > 150 ? 'Unhealthy' : pm25Val > 50 ? 'Moderate' : 'Good'}
          city={selectedCity.displayName}
          temperature="22°C"
          humidity="42%"
          windSpeed="8km"
          isLoading={isLoading}
        />

        {/* Pollutant Breakdown Matrix */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-cyber-text-muted px-1 block">
            Measured Pollutants • μg/m³
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="cyber-card p-4 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-cyber-text-secondary">Fine Particles (PM2.5)</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                {isLoading ? '...' : `${Math.round(pm25Val)}`}
                <span className="text-xs font-normal text-slate-500 dark:text-cyber-text-muted ml-1">μg/m³</span>
              </div>
              <span className="text-[10px] text-teal-700 dark:text-cyber-teal font-bold block">Primary driver</span>
            </div>

            <div className="cyber-card p-4 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-cyber-text-secondary">Coarse Dust (PM10)</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                {isLoading ? '...' : `${Math.round(pm10Val)}`}
                <span className="text-xs font-normal text-slate-500 dark:text-cyber-text-muted ml-1">μg/m³</span>
              </div>
              <span className="text-[10px] text-slate-600 dark:text-cyber-text-secondary font-medium block">Road/windblown</span>
            </div>

            <div className="cyber-card p-4 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-cyber-text-secondary">Nitrogen Dioxide (NO2)</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                {isLoading ? '...' : `${Math.round(no2Val)}`}
                <span className="text-xs font-normal text-slate-500 dark:text-cyber-text-muted ml-1">ppb</span>
              </div>
              <span className="text-[10px] text-blue-700 dark:text-cyber-blue font-medium block">Combustion proxy</span>
            </div>

            <div className="cyber-card p-4 rounded-2xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-cyber-text-secondary">Ozone (O3)</span>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-display">
                {isLoading ? '...' : `${Math.round(o3Val)}`}
                <span className="text-xs font-normal text-slate-500 dark:text-cyber-text-muted ml-1">ppb</span>
              </div>
              <span className="text-[10px] text-slate-600 dark:text-cyber-text-secondary font-medium block">Afternoon peak</span>
            </div>
          </div>

          {/* Provenance Card */}
          <div className="cyber-card p-3.5 rounded-2xl flex items-center justify-between text-xs text-slate-600 dark:text-cyber-text-secondary">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyber-blue" />
              <span>Provider: Copernicus CAMS / Open-Meteo</span>
            </div>
            <span className="text-[11px] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-300 dark:border-white/10 font-semibold text-slate-800 dark:text-white">
              CC BY 4.0
            </span>
          </div>
        </div>
      </div>

      {/* 24-Hour Forecast Timeline */}
      <div className="cyber-card p-6 sm:p-7 rounded-[32px] space-y-4">
        <PollutantTimeline
          evidenceRecords={evidenceBundle?.records || []}
          pollutant="PM2.5"
          unit="μg/m³"
        />
      </div>
    </div>
  );
}
