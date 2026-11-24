import React from 'react';
import { MapPin, Check } from 'lucide-react';

/**
 * LandingMobileShowcase Component
 *
 * 3-Phone Interactive Mobile Mockup Showcase highlighting:
 * 1. Real-Time AQI Gauge
 * 2. Routine Shift & Commute Planner
 * 3. Indoor Air Coach
 */
export function LandingMobileShowcase() {
  return (
    <section className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
          Mobile-First Experience
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Built for Clean Living on the Go
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-cyber-text-secondary">
          Three core mobile workflows designed for Indian commuters and modern households.
        </p>
      </div>

      {/* 3-Phone Showcase Grid */}
      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto items-start">
        {/* Phone 1: Urban Air Intelligence & Gauge */}
        <div className="flex flex-col items-center">
          <div className="phone-mockup">
            <div className="phone-screen-inner p-5 space-y-4">
              <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>9:41 AM</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal" />
                  <span>CPCB LIVE</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-100 dark:bg-white/5 p-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
                <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
                  <MapPin className="w-3.5 h-3.5 text-cyber-teal" />
                  <span>Connaught Place, Delhi</span>
                </div>
                <span className="text-[10px] text-cyber-teal font-mono">STATION #104</span>
              </div>

              <div className="flex flex-col items-center py-2 relative">
                <div className="relative w-36 h-36 rounded-full border-4 border-cyber-teal/30 flex items-center justify-center bg-gradient-to-br from-cyber-teal/10 to-transparent shadow-cyber-glow-teal">
                  <div className="text-center space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest font-bold">PM 2.5</span>
                    <div className="text-3xl font-black text-slate-900 dark:text-white font-display">024</div>
                    <span className="inline-block text-[10px] font-bold bg-cyber-teal text-slate-950 px-2 py-0.5 rounded-full">
                      Good
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-100 dark:bg-white/5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">
                <div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">TEMP</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">22°C</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">HUMIDITY</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">42%</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">WIND</div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">8 km/h</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gradient-to-r from-cyber-teal/15 to-transparent border border-cyber-teal/30">
                <img
                  src="/assets/indian-air-purifier-tech.jpg"
                  alt="Smart Air Purifier"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">Smart Filter Mode</div>
                  <div className="text-[9px] text-teal-700 dark:text-cyber-teal font-semibold">Auto-purification active</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">01 · Real-Time AQI Gauge</h4>
            <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">Official CPCB & CAMS verified ingestion</p>
          </div>
        </div>

        {/* Phone 2: Routine Shift & Commute Planner */}
        <div className="flex flex-col items-center">
          <div className="phone-mockup">
            <div className="phone-screen-inner p-5 space-y-4">
              <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>ROUTINE</span>
                <span className="text-teal-700 dark:text-cyber-teal font-bold">OPTIMIZED</span>
              </div>

              <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono uppercase">DEPARTURE</span>
                    <div className="text-xl font-black text-slate-900 dark:text-white font-display">07:45 AM</div>
                  </div>
                  <span className="text-[10px] font-bold bg-cyber-teal text-slate-950 px-2 py-1 rounded-lg">
                    -30m Shift
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                  ✓ Avoids 8:30 AM boundary layer smog
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                  <span className="w-5 h-5 rounded-full bg-cyber-teal text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium flex-1 truncate">Walk 6 mins to Metro Station</span>
                  <span className="text-[9px] text-teal-700 dark:text-cyber-teal font-mono font-bold">0g CO2</span>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                  <span className="w-5 h-5 rounded-full bg-cyber-blue text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium flex-1 truncate">Metro Rail (Blue Line)</span>
                  <span className="text-[9px] text-blue-700 dark:text-cyber-blue font-mono font-bold">22 mins</span>
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                  <span className="w-5 h-5 rounded-full bg-cyber-purple text-slate-950 font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span className="text-slate-900 dark:text-white font-medium flex-1 truncate">Arrive at office early</span>
                  <span className="text-[9px] text-purple-700 dark:text-cyber-purple font-mono font-bold">-480g CO2</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-cyber-teal/15 border border-teal-200 dark:border-cyber-teal/30 text-center">
                <div className="text-[9px] font-mono text-teal-800 dark:text-cyber-teal uppercase tracking-wider font-bold">TAILPIPE REDUCTION</div>
                <div className="text-base font-black text-slate-900 dark:text-white font-display">-480g CO2 avoided</div>
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">02 · Commute Shift Planner</h4>
            <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">ARAI 2024 calibrated emissions math</p>
          </div>
        </div>

        {/* Phone 3: Indoor Air Coach */}
        <div className="flex flex-col items-center">
          <div className="phone-mockup">
            <div className="phone-screen-inner p-5 space-y-4">
              <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                <span>INDOOR AIR</span>
                <span className="text-teal-700 dark:text-cyber-teal font-bold">LIVING ROOM</span>
              </div>

              <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-cyber-teal flex items-center justify-center text-xs font-black text-slate-900 dark:text-white font-mono shrink-0">
                  84%
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">HEPA Filter Health</div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-300">Clean airflow confirmed</div>
                </div>
              </div>

              <div className="flex gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-cyber-teal text-slate-950 font-bold text-[10px]">Living</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-[10px] border border-slate-200 dark:border-white/10">Kitchen</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-[10px] border border-slate-200 dark:border-white/10">Bedroom</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white">
                  <Check className="w-3.5 h-3.5 text-cyber-teal" />
                  <span className="text-[11px]">Range hood vented outdoors</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white">
                  <Check className="w-3.5 h-3.5 text-cyber-teal" />
                  <span className="text-[11px]">Areca palm & snake plants active</span>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white">
                  <Check className="w-3.5 h-3.5 text-cyber-teal" />
                  <span className="text-[11px]">CO detector operational</span>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 aspect-[2/1]">
                <img
                  src="/assets/indian-indoor-wellness.jpg"
                  alt="Indian Apartment Clean Air"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-display">03 · Indoor Air Coach</h4>
            <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">Source control & kitchen exhaust guidance</p>
          </div>
        </div>
      </div>
    </section>
  );
}
