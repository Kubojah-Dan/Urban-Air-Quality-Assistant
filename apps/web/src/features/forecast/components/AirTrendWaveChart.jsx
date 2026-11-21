import React, { useState } from 'react';
import { Clock, TrendingDown, ChevronDown } from 'lucide-react';

export function AirTrendWaveChart({ records = [] }) {
  const [timeView, setTimeView] = useState('day');

  const points = [
    { hour: '12 AM', value: 18 },
    { hour: '3 AM', value: 24 },
    { hour: '6 AM', value: 42 },
    { hour: '9 AM', value: 68 },
    { hour: '12 PM', value: 35 },
    { hour: '3 PM', value: 28 },
    { hour: '6 PM', value: 48 },
    { hour: '9 PM', value: 22 },
    { hour: '12 AM', value: 16 }
  ];

  const width = 500;
  const height = 140;
  const paddingX = 20;
  const paddingY = 20;

  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (p.value / 80) * (height - 2 * paddingY);
    return { ...p, x, y };
  });

  let pathD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i];
    const p1 = coords[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  const barColumns = [
    { day: 'Sat', active: 3 },
    { day: 'Sun', active: 4 },
    { day: 'Mon', active: 2 },
    { day: 'Thu', active: 3 },
    { day: 'Wed', active: 5 },
    { day: 'Thu', active: 3 },
    { day: 'Fri', active: 2 }
  ];

  return (
    <div className="cyber-card p-6 sm:p-7 space-y-6">
      {/* Header & Segmented Day/Week Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display block">
            Environmental Dynamics
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Air Quality & Infiltration Trend
          </h3>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10">
          <button
            type="button"
            onClick={() => setTimeView('day')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              timeView === 'day'
                ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal'
                : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Day
          </button>
          <button
            type="button"
            onClick={() => setTimeView('week')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer ${
              timeView === 'week'
                ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal'
                : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Smooth Glowing Neon Wave Graph */}
      <div className="relative p-4 rounded-3xl bg-slate-50/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden">
        {/* Floating peak indicator badge */}
        <div className="absolute top-4 right-1/3 bg-slate-900 dark:bg-black/90 border border-cyber-teal/40 rounded-xl px-2.5 py-1 text-[10px] font-bold text-cyber-teal shadow-cyber-glow-teal flex items-center gap-1.5 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal animate-ping" />
          <span>10:00 AM • Very Good (12 μg/m³)</span>
        </div>

        <svg className="w-full h-36" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5BE" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#00E5BE" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00E5BE" stopOpacity="0" />
            </linearGradient>
            <filter id="waveGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Area Fill */}
          <path d={areaD} fill="url(#waveAreaGradient)" />

          {/* Glowing Stroke Curve */}
          <path
            d={pathD}
            fill="none"
            stroke="#00E5BE"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#waveGlow)"
          />

          <circle cx={coords[3].x} cy={coords[3].y} r="5" fill="#00E5BE" stroke="#FFFFFF" strokeWidth="2" />
        </svg>

        {/* X-Axis Hour Labels */}
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-cyber-text-muted px-2 pt-2 border-t border-slate-200 dark:border-white/5 font-semibold">
          <span>12 AM</span>
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>12 AM</span>
        </div>
      </div>

      {/* Fan Speed / Pollutant Bar Matrix */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-cyber-text-secondary">
          <span className="text-slate-900 dark:text-white">Active Mitigation & Fan Speed</span>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyber-teal" />
              Auto
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyber-purple" />
              Manual
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          {barColumns.map((col, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div className="flex flex-col-reverse gap-1 h-20 items-center justify-start w-full">
                {Array.from({ length: 5 }).map((_, blockIdx) => {
                  const isFilled = blockIdx < col.active;
                  const isPurple = blockIdx % 2 === 1;
                  return (
                    <div
                      key={blockIdx}
                      className={`w-full max-w-[14px] h-3 rounded-md transition-all ${
                        isFilled
                          ? isPurple
                            ? 'bg-cyber-purple shadow-xs'
                            : 'bg-cyber-teal shadow-xs'
                          : 'bg-slate-200 dark:bg-white/5'
                      }`}
                    />
                  );
                })}
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-cyber-text-secondary mt-1">{col.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
