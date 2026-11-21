import React from 'react';
import { Wind, Droplets, Thermometer, MapPin, Sun } from 'lucide-react';

/**
 * CircularAqiGauge
 *
 * Futuristic Climate Dial.
 * Adapted for both Dark Cyber & Clean Light themes with 100% crystal-clear contrast.
 */
export function CircularAqiGauge({
  aqi = 12,
  pollutant = 'PM 2.5',
  temperature = '8°C',
  humidity = '38%',
  windSpeed = '4km',
  category = 'Good',
  city = 'Delhi, India',
  isLoading = false
}) {
  const clampedAqi = Math.max(0, Math.min(300, aqi));
  const maxScale = 300;
  const percentage = Math.min(1, clampedAqi / maxScale);

  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - arcLength * percentage;

  let accentColor = '#00E5BE';
  let glowColor = 'rgba(0, 229, 190, 0.45)';
  let categoryLabel = category || 'Good';

  if (clampedAqi > 50 && clampedAqi <= 100) {
    accentColor = '#38BDF8';
    glowColor = 'rgba(56, 189, 248, 0.4)';
    categoryLabel = category || 'Satisfactory';
  } else if (clampedAqi > 100 && clampedAqi <= 200) {
    accentColor = '#F59E0B';
    glowColor = 'rgba(245, 158, 11, 0.45)';
    categoryLabel = category || 'Moderate';
  } else if (clampedAqi > 200) {
    accentColor = '#EF4444';
    glowColor = 'rgba(239, 68, 68, 0.45)';
    categoryLabel = category || 'Unhealthy';
  }

  const tickCount = 48;
  const ticks = Array.from({ length: tickCount }).map((_, i) => {
    const angle = (i / tickCount) * 240 - 210;
    return { id: i, angle };
  });

  return (
    <div className="relative cyber-card p-6 sm:p-7 flex flex-col items-center justify-between min-h-[360px] overflow-hidden">
      {/* Background radial ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-colors duration-700 opacity-60"
        style={{ background: glowColor }}
      />

      {/* Top Header: Weather pill + Location */}
      <div className="relative z-10 w-full flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-bold">
          <Sun className="w-3.5 h-3.5 text-cyber-amber" />
          <span>20° Clear</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-600 dark:text-cyber-text-secondary font-semibold">
          <MapPin className="w-3.5 h-3.5 text-cyber-teal" />
          <span className="text-slate-900 dark:text-white text-xs font-bold">{city.split(',')[0]}</span>
        </div>
      </div>

      {/* Center Dial Container */}
      <div className="relative z-10 w-64 h-64 flex items-center justify-center my-1">
        {/* Radiating Perimeter Tick Marks */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {ticks.map((tick) => (
            <div
              key={tick.id}
              className="absolute w-0.5 h-2 bg-slate-300 dark:bg-white/20 origin-center"
              style={{
                transform: `rotate(${tick.angle}deg) translateY(-104px)`
              }}
            />
          ))}
        </div>

        {/* SVG Circular Progress Arc */}
        <svg className="w-56 h-56 -rotate-210" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="cyberAqiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00E5BE" />
              <stop offset="60%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor={accentColor} />
            </linearGradient>
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-white/10"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
          />

          {/* Glowing Active Arc */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#cyberAqiGradient)"
            strokeWidth="9"
            strokeLinecap="round"
            filter="url(#neonGlow)"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={isLoading ? arcLength : strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout with high contrast in both modes */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-cyber-text-secondary mb-0.5">
            {pollutant}
          </span>
          <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
            {isLoading ? '...' : String(Math.round(aqi)).padStart(3, '0')}
          </div>

          {/* Mini Weather Row */}
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-cyber-text-secondary mt-1 pt-1 border-t border-slate-200 dark:border-white/10">
            <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-white">
              <Thermometer className="w-3 h-3 text-cyber-amber" />
              {temperature}
            </span>
            <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-white">
              <Wind className="w-3 h-3 text-cyber-teal" />
              {windSpeed}
            </span>
            <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-white">
              <Droplets className="w-3 h-3 text-cyber-blue" />
              {humidity}
            </span>
          </div>

          {/* Bottom Glowing Status Capsule Pill */}
          <div
            className="mt-3 px-6 py-1 rounded-full text-xs font-black tracking-wide uppercase transition-all shadow-cyber-glow-teal"
            style={{
              backgroundColor: accentColor,
              color: '#081016'
            }}
          >
            {categoryLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
