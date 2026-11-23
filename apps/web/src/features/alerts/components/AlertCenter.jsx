import React, { useState } from 'react';
import { Bell, BellOff, X, AlertTriangle, Wind, Clock, Sparkles, Check, Settings } from 'lucide-react';

const ALERTS_STORAGE_KEY = 'dayshift_alert_preferences';

export function AlertCenter({ currentPm25 = 65, selectedCity = 'Delhi, India' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem(ALERTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      aqiSpikes: true,
      inversionAlerts: true,
      ventilationWindows: true,
      departureShift: true,
      thresholdPm25: 80
    };
  });

  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const togglePref = (key) => {
    const updated = { ...preferences, [key]: !preferences[key] };
    setPreferences(updated);
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  // Generate actionable contextual alerts based on live PM2.5 and morning/afternoon cycle
  const currentHour = new Date().getHours();
  const activeAlerts = [
    {
      id: 'alert_inversion_peak',
      type: 'forecast',
      title: 'Morning Surface Inversion Window',
      category: 'Inversion Alert',
      severity: 'moderate',
      message: 'Planetary boundary layer is compressed. Curbside diesel plumes are dense near arterial junctions.',
      action: 'Shift departure 30m earlier or enable vehicle AC cabin recirculation.',
      enabled: preferences.inversionAlerts && currentHour >= 6 && currentHour <= 10
    },
    {
      id: 'alert_ventilation_window',
      type: 'forecast',
      title: 'Optimal Natural Ventilation Window Approaching',
      category: 'Ventilation Advisory',
      severity: 'optimal',
      message: 'Solar heating is lifting the inversion layer. PM2.5 drops to lowest daytime baseline between 01:00 PM and 03:30 PM.',
      action: 'Open opposite windows for 20 minutes to flush indoor CO₂ without high ambient particulate intake.',
      enabled: preferences.ventilationWindows
    },
    {
      id: 'alert_aqi_spike',
      type: 'observed',
      title: `Elevated PM₂.₅ Observed (${Math.round(currentPm25)} µg/m³)`,
      category: 'Observed Telemetry',
      severity: currentPm25 > 90 ? 'high' : 'moderate',
      message: `Continuous monitoring station reports PM2.5 at ${Math.round(currentPm25)} µg/m³ in ${selectedCity.split(',')[0]}.`,
      action: 'Avoid strenuous outdoor aerobic exercise near heavy roadway corridors.',
      enabled: preferences.aqiSpikes && currentPm25 >= preferences.thresholdPm25
    }
  ].filter((a) => a.enabled && !dismissedAlerts.includes(a.id));

  const dismissAlert = (id) => {
    setDismissedAlerts((prev) => [...prev, id]);
  };

  return (
    <div className="relative">
      {/* Alert Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Environmental alerts"
        className="relative p-2 rounded-xl text-slate-700 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {activeAlerts.length > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyber-teal ring-2 ring-white dark:ring-[#101726] animate-pulse" />
        )}
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl cyber-card-elevated shadow-2xl border border-slate-200 dark:border-white/15 p-4 z-50 animate-in fade-in space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs text-slate-900 dark:text-white font-display">
                Smart Contextual Alerts
              </span>
              <span className="text-[10px] font-mono bg-cyber-teal/20 text-cyber-teal px-1.5 py-0.2 rounded font-bold">
                {activeAlerts.length} Active
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                title="Configure alert triggers"
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Preferences Settings Drawer */}
          {showSettings && (
            <div className="p-3 bg-slate-100 dark:bg-black/30 rounded-xl space-y-2 text-xs border border-slate-200 dark:border-white/5">
              <span className="font-bold text-slate-900 dark:text-white block text-[11px]">
                Alert Preferences
              </span>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-cyber-text-secondary text-[11px]">PM₂.₅ Spikes (&gt; {preferences.thresholdPm25} µg/m³)</span>
                <input
                  type="checkbox"
                  checked={preferences.aqiSpikes}
                  onChange={() => togglePref('aqiSpikes')}
                  className="rounded text-cyber-teal accent-cyber-teal"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-cyber-text-secondary text-[11px]">Surface Inversion Traps</span>
                <input
                  type="checkbox"
                  checked={preferences.inversionAlerts}
                  onChange={() => togglePref('inversionAlerts')}
                  className="rounded text-cyber-teal accent-cyber-teal"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-cyber-text-secondary text-[11px]">Ideal Ventilation Windows</span>
                <input
                  type="checkbox"
                  checked={preferences.ventilationWindows}
                  onChange={() => togglePref('ventilationWindows')}
                  className="rounded text-cyber-teal accent-cyber-teal"
                />
              </label>
            </div>
          )}

          {/* Alerts List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {activeAlerts.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-cyber-text-muted space-y-1">
                <Check className="w-5 h-5 mx-auto text-emerald-500" />
                <p className="font-bold text-slate-700 dark:text-slate-300">No Urgent Atmospheric Alerts</p>
                <p className="text-[11px]">Current readings in {selectedCity.split(',')[0]} are within normal baseline.</p>
              </div>
            ) : (
              activeAlerts.map((alt) => (
                <div
                  key={alt.id}
                  className={`p-3 rounded-xl border text-xs space-y-1.5 transition ${
                    alt.severity === 'high'
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : alt.severity === 'optimal'
                      ? 'bg-teal-500/10 border-cyber-teal/40'
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-900 dark:text-white font-display text-[11px]">
                          {alt.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold bg-white/40 dark:bg-white/10 text-slate-700 dark:text-cyber-text-secondary">
                          {alt.type}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-cyber-text-muted">
                        {alt.category}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => dismissAlert(alt.id)}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-700 dark:text-slate-200">
                    {alt.message}
                  </p>

                  <div className="p-2 rounded-lg bg-white/70 dark:bg-black/30 text-[10px] text-slate-800 dark:text-slate-100 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyber-teal shrink-0" />
                    <span>{alt.action}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
