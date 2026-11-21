import React, { useState } from 'react';
import {
  ArrowRight, Wind, ShieldCheck, Sparkles, Compass, CheckCircle2,
  Leaf, BarChart3, Clock, Home, Zap, MapPin, Gauge, Activity,
  ChevronRight, RefreshCw, Car, Check
} from 'lucide-react';
import { CITIES } from '../../location/api/locationApi.js';

export function LandingPage({ onStartOnboarding, onExploreAirQuality }) {
  const [activeScreenTab, setActiveScreenTab] = useState('commute');
  const [selectedStateFilter, setSelectedStateFilter] = useState('All');

  // Group cities by state for the quick-state badge bar
  const indianStates = Array.from(
    new Set(CITIES.filter((c) => c.countryCode === 'IN').map((c) => c.state))
  ).filter(Boolean);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* =========================================================
          1. HERO SECTION: High Contrast, Glowing Accents, Clean Typography
          ========================================================= */}
      <section className="relative overflow-hidden rounded-[32px] cyber-card-elevated p-6 sm:p-10 lg:p-14 text-center">
        {/* Ambient atmospheric lighting */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-cyber-teal/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-cyber-blue/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white text-xs font-bold shadow-xs">
              <img src="/dayshift-logo.svg" alt="DayShift" className="h-5 w-auto" />
              <span>AI Urban Air Quality Assistant</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyber-teal/15 text-cyber-teal border border-cyber-teal/30 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>All 28 Indian States & NCR Covered</span>
            </div>
          </div>

          {/* CRITICAL: High-contrast, 100% visible headline in both light and dark themes */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-[1.15]">
            Make every day a{' '}
            <span className="text-cyber-teal neon-text-teal">
              cleaner choice.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-cyber-text-secondary font-medium max-w-2xl mx-auto leading-relaxed">
            Your day. Your choices. Cleaner air. DayShift delivers realistic, constraint-aware routine guidance,
            verifying what is known, estimated, and unmeasured without demanding continuous GPS or expensive equipment.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={onStartOnboarding}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-cyber-teal text-slate-950 font-black text-sm shadow-cyber-glow-teal hover:opacity-95 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Build my daily routine</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onExploreAirQuality}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bold text-sm border border-slate-300 dark:border-white/15 transition-all cursor-pointer shadow-xs"
            >
              <Compass className="w-4 h-4 text-cyber-blue" />
              <span>Explore air quality</span>
            </button>
          </div>

          {/* Feature Showcase Banner (Indian Clean Commute Image) */}
          <div className="pt-6">
            <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full rounded-[28px] overflow-hidden border border-slate-300 dark:border-white/15 shadow-2xl group">
              <img
                src="/assets/indian-clean-commute.jpg"
                alt="Modern Clean Urban Mobility in India — Electric Metro & Clean Transit"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-8 text-left">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-cyber-teal bg-black/60 px-2.5 py-1 rounded-full border border-cyber-teal/30">
                      Urban Transit Model
                    </span>
                    <h3 className="text-lg sm:text-2xl font-extrabold text-white font-display">
                      Clean Commuting for Modern Indian Metros
                    </h3>
                    <p className="text-xs text-slate-200 max-w-xl hidden sm:block">
                      Combining electric buses, metro rail networks, and departure time shifting to avoid peak morning temperature inversions.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md p-2.5 rounded-2xl border border-white/15 text-xs text-white">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyber-teal animate-pulse" />
                    <span className="font-bold">ARAI 2024 Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Provenance Guarantees */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-cyber-text-secondary">
            <span className="flex items-center gap-1.5 text-slate-800 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-cyber-teal" />
              Zero continuous GPS tracking
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-slate-800 dark:text-white">
              <CheckCircle2 className="w-4 h-4 text-cyber-blue" />
              ARAI 2024 & EPA MOVES factors
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-white/20">•</span>
            <span className="flex items-center gap-1.5 text-slate-800 dark:text-white">
              <Sparkles className="w-4 h-4 text-cyber-purple" />
              DPDP Act 2023 compliant
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. INTERACTIVE PHONE SHOWCASE (Inspired by Template & Reference Images)
          ========================================================= */}
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
                {/* Phone Top Status */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>9:41 AM</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal" />
                    <span>CPCB LIVE</span>
                  </div>
                </div>

                {/* Location Capsule */}
                <div className="flex items-center justify-between bg-slate-100 dark:bg-white/5 p-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-900 dark:text-white font-bold">
                    <MapPin className="w-3.5 h-3.5 text-cyber-teal" />
                    <span>Connaught Place, Delhi</span>
                  </div>
                  <span className="text-[10px] text-cyber-teal font-mono">STATION #104</span>
                </div>

                {/* Circular Gauge Preview */}
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

                {/* Micro Weather Bar */}
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

                {/* Air Purifier Promo Mini Card */}
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
                {/* Phone Top Status */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>ROUTINE</span>
                  <span className="text-teal-700 dark:text-cyber-teal font-bold">OPTIMIZED</span>
                </div>

                {/* When / Then Header Card */}
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

                {/* Step List Sequence */}
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

                {/* Commute Savings Pill */}
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
                {/* Phone Top Status */}
                <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>INDOOR AIR</span>
                  <span className="text-teal-700 dark:text-cyber-teal font-bold">LIVING ROOM</span>
                </div>

                {/* Filter Life Ring */}
                <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-xl border border-slate-200 dark:border-white/10 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-cyber-teal flex items-center justify-center text-xs font-black text-slate-900 dark:text-white font-mono shrink-0">
                    84%
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">HEPA Filter Health</div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-300">Clean airflow confirmed</div>
                  </div>
                </div>

                {/* Room Pills */}
                <div className="flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-cyber-teal text-slate-950 font-bold text-[10px]">
                    Living
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-[10px] border border-slate-200 dark:border-white/10">
                    Kitchen
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-[10px] border border-slate-200 dark:border-white/10">
                    Bedroom
                  </span>
                </div>

                {/* Checklist */}
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

                {/* Purifier Image Feature */}
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

      {/* =========================================================
          3. INDIAN LIFESTYLE & MOBILITY PHOTO GALLERY (All 5 Generated Photos)
          ========================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
            Aesthetic Visuals
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Designed for Modern Indian Cities
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-cyber-text-secondary">
            From smart metro transit to indoor apartment wellness, DayShift integrates seamlessly into everyday routines.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Photo 1: Clean Commute */}
          <div className="cyber-card rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-cyber-teal/40 transition-all group">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src="/assets/indian-clean-commute.jpg"
                alt="Clean Indian Commute"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-black/70 text-cyber-teal px-2.5 py-1 rounded-full border border-cyber-teal/30">
                Metro & EV Bus
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-display">
                  Multi-Modal Indian Commute
                </h3>
                <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-1 leading-relaxed">
                  Real transit integration across Delhi Metro, Bengaluru Namma Metro, Mumbai Line 2A/7, and electric feeder buses.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-cyber-teal flex items-center gap-1">
                <span>Avoid curb-level diesel fumes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Photo 2: Smart Watch & Metro Platform */}
          <div className="cyber-card rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-cyber-teal/40 transition-all group">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src="/assets/indian-smart-transit-metro.jpg"
                alt="Indian Commuter Checking Air Quality on Smartwatch at Metro Station"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-black/70 text-cyber-blue px-2.5 py-1 rounded-full border border-cyber-blue/30">
                Smart Wearables
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-display">
                  Contextual Smartwatch Guidance
                </h3>
                <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-1 leading-relaxed">
                  Glanceable air intelligence on arrival times, optimal transfer stations, and shaded walking paths.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-cyber-blue flex items-center gap-1">
                <span>Instant atmospheric cues</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Photo 3: Smart Purifier Living Room */}
          <div className="cyber-card rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-cyber-teal/40 transition-all group">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src="/assets/indian-air-purifier-tech.jpg"
                alt="Cylindrical Smart Air Purifier with Glowing LED in Modern Indian Apartment"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-black/70 text-cyber-teal px-2.5 py-1 rounded-full border border-cyber-teal/30">
                Purification Tech
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-display">
                  Sleek Smart Air Technology
                </h3>
                <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-1 leading-relaxed">
                  Real-time CADR-rated clean air delivery, digital filter life tracking, and quiet nocturnal fan modes.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-cyber-teal flex items-center gap-1">
                <span>Optimized filter longevity</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Photo 4: Indoor Apartment Wellness */}
          <div className="cyber-card rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-cyber-teal/40 transition-all group">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src="/assets/indian-indoor-wellness.jpg"
                alt="Sunlit Indian Living Room with Areca Palm and Clean Air Coach"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-black/70 text-cyber-purple px-2.5 py-1 rounded-full border border-cyber-purple/30">
                Indoor Coach
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-display">
                  Household Air & Cooking Safety
                </h3>
                <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-1 leading-relaxed">
                  Clear protocols on tadka frying ventilation, agarbatti/dhoop smoke management, and cross-breeze timing.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-cyber-purple flex items-center gap-1">
                <span>No-purchase source control</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Photo 5: Morning Active Walk in Urban Park */}
          <div className="cyber-card rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-cyber-teal/40 transition-all group">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src="/assets/indian-morning-routine.jpg"
                alt="Active Morning Walk in Green Urban Park"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-black/70 text-cyber-amber px-2.5 py-1 rounded-full border border-cyber-amber/30">
                Outdoor Fitness
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-display">
                  Beat the Winter Inversion Layer
                </h3>
                <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-1 leading-relaxed">
                  Pinpoint safe hours for running, cycling, and walking when daytime solar heating lifts trapped smog.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-cyber-amber flex items-center gap-1">
                <span>CAMS atmospheric forecast</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Photo 6: Sustainable EV Transport */}
          <div className="cyber-card rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-cyber-teal/40 transition-all group">
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src="/assets/ev-car.jpg"
                alt="Electric Vehicle Sustainable Charging Companion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-black/70 text-cyber-teal px-2.5 py-1 rounded-full border border-cyber-teal/30">
                EV Mobility
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-display">
                  Zero Tailpipe EV Charging
                </h3>
                <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-1 leading-relaxed">
                  Shift to electric 2-wheelers and 4-wheelers with transparent lifecycle grid factor disclosures.
                </p>
              </div>
              <div className="pt-2 text-xs font-bold text-cyber-teal flex items-center gap-1">
                <span>Zero curb emissions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. ALL 28 INDIAN STATES & UTs INTERACTIVE COVERAGE BAR
          ========================================================= */}
      <section className="cyber-card p-6 sm:p-8 rounded-[32px] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
              National Footprint
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-display">
              Covering All 28 Indian States & Union Territories
            </h3>
          </div>
          <div className="text-xs font-mono text-slate-600 dark:text-cyber-text-secondary">
            Continuous CPCB + Copernicus CAMS Regional Ingestion
          </div>
        </div>

        {/* State Badges Grid */}
        <div className="flex flex-wrap gap-2 pt-2">
          {indianStates.map((state) => (
            <span
              key={state}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-white hover:border-cyber-teal hover:text-cyber-teal transition-all cursor-default"
            >
              {state}
            </span>
          ))}
        </div>
      </section>

      {/* =========================================================
          5. THREE SIMPLE STEPS
          ========================================================= */}
      <section className="cyber-card p-8 sm:p-10 rounded-[32px] space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
            Evidence-First Flow
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            How DayShift works in three simple steps
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black flex items-center justify-center text-sm shadow-md font-display">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Select Your State & Schedule</h4>
            <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
              Choose from all 28 Indian States and UTs. Enter your commute hours without sharing exact GPS coordinates.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-cyber-teal text-slate-950 font-black flex items-center justify-center text-sm shadow-cyber-glow-teal font-display">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Live Regional Ingestion</h4>
            <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
              Cross-checks Copernicus CAMS hourly forecasts and CPCB stations with official ARAI 2024 emission factors.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-5 rounded-2xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-full bg-cyber-blue text-slate-950 font-black flex items-center justify-center text-sm shadow-cyber-glow-blue font-display">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Get Your Impact Receipt</h4>
            <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
              Review transparent trade-offs, ask the AI assistant for scoped adjustments, or test household air safety.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. SIGNATURE IMPACT RECEIPT CALLOUT
          ========================================================= */}
      <section className="cyber-card-elevated p-6 sm:p-10 rounded-[32px] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] uppercase font-black tracking-widest text-cyber-teal font-display">
              Signature Analytical Report
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
              The 3-Channel Impact Receipt
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-cyber-text-secondary max-w-xl leading-relaxed">
              Never an invented aggregate "clean score." DayShift clearly separates ambient outdoor air context,
              indoor mitigation mechanisms, and verified tailpipe emissions deltas.
            </p>
          </div>

          <button
            type="button"
            onClick={onStartOnboarding}
            className="flex-shrink-0 px-8 py-4 rounded-2xl bg-cyber-teal text-slate-950 font-black text-xs hover:opacity-95 transition shadow-cyber-glow-teal cursor-pointer"
          >
            Try Interactive Demo
          </button>
        </div>
      </section>
    </div>
  );
}
