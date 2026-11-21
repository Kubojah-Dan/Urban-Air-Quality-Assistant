import React, { useState, useEffect } from 'react';
import { CircularAqiGauge } from '../../forecast/components/CircularAqiGauge.jsx';
import { AirTrendWaveChart } from '../../forecast/components/AirTrendWaveChart.jsx';
import { PollutantTimeline } from '../../forecast/components/PollutantTimeline.jsx';
import { RoutineInputForm } from '../components/RoutineInputForm.jsx';
import { DecisionBoard } from '../components/DecisionBoard.jsx';
import { EvidenceDisclosure } from '../../impact/components/EvidenceDisclosure.jsx';
import { ContextualAssistant } from '../../assistant/components/ContextualAssistant.jsx';
import { IndoorActionCoach } from '../../indoor/components/IndoorActionCoach.jsx';
import { useAirEvidence } from '../../forecast/hooks/useAirEvidence.js';
import { useRoutinePlan } from '../hooks/useRoutinePlan.js';
import { UrbanAirMap } from '../../forecast/components/UrbanAirMap.jsx';
import { ArrowLeft, Sparkles, RefreshCw, Compass, Clock, Car, Wind, CheckCircle2, Zap, MapPin, Map } from 'lucide-react';

export function TodayPage({ initialContext, onBackToStart }) {
  const location = initialContext?.city || {
    cityId: 'delhi',
    countryCode: 'IN',
    displayName: 'Delhi (NCR), Delhi',
    latitude: 28.6139,
    longitude: 77.2090,
    timeZone: 'Asia/Kolkata'
  };

  const { data: evidenceBundle, isLoading: isEvidenceLoading, refetch: refetchEvidence } = useAirEvidence(location);
  const { data: planData, isLoading: isPlanLoading, generatePlan, revisePlan } = useRoutinePlan(location);

  const [currentBaseline, setCurrentBaseline] = useState(null);
  const [revisionLog, setRevisionLog] = useState([]);
  const [activeTab, setActiveTab] = useState('board'); // 'board', 'forecast', 'indoor'

  useEffect(() => {
    const dep = initialContext?.initialContext?.departureTime || '08:00';
    const dead = initialContext?.initialContext?.deadlineTime || '09:00';
    const transitFeasible =
      initialContext?.initialContext?.transitFeasible !== undefined
        ? initialContext.initialContext.transitFeasible
        : true;

    const initialBaseline = {
      id: `base_${Date.now()}`,
      activityType: 'commute',
      activities: [
        {
          id: 'act_1',
          name: initialContext?.task === 'outdoor' ? 'Outdoor Time / Errand' : 'Daily Work Commute',
          type: 'commute',
          startWindow: dep,
          endWindow: dead,
          mode: 'drive'
        }
      ],
      constraints: [
        {
          id: 'con_arrival',
          type: 'hard',
          description: `Must arrive by ${dead}`,
          parameter: 'mustArriveBy',
          value: dead
        },
        {
          id: 'con_departure',
          type: 'hard',
          description: `Cannot leave earlier than ${dep}`,
          parameter: 'cannotLeaveEarlier',
          value: dep
        },
        {
          id: 'con_transit',
          type: 'hard',
          description: transitFeasible ? 'Transit is available' : 'Transit is unavailable',
          parameter: 'transitUnavailable',
          value: !transitFeasible
        }
      ]
    };

    setCurrentBaseline(initialBaseline);
    generatePlan(initialBaseline, location);
  }, [location?.cityId]);

  const handleCreatePlan = async (baseline) => {
    setCurrentBaseline(baseline);
    setRevisionLog([]);
    await generatePlan(baseline, location);
  };

  const handleReviseConstraint = async (modifiedConstraint) => {
    if (currentBaseline) {
      const res = await revisePlan(currentBaseline, modifiedConstraint, location);
      if (res?.scopedRevisionLog) {
        setRevisionLog(res.scopedRevisionLog);
      }
    }
  };

  const primaryPm25 =
    evidenceBundle?.records?.find((r) => r.recordKind === 'observation')?.value ||
    evidenceBundle?.records?.find((r) => r.pollutant === 'PM2.5')?.value ||
    18;

  return (
    <div className="space-y-6 sm:space-y-8 pb-16 max-w-6xl mx-auto">
      {/* Top Greeting & Location Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBackToStart && (
            <button
              type="button"
              onClick={onBackToStart}
              className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-700 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-white/10 transition cursor-pointer"
              aria-label="Back to Overview"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display block">
                Urban Intelligence • Live
              </span>
              <span className="text-[10px] bg-cyber-teal/15 text-cyber-teal px-2 py-0.5 rounded-md font-bold">
                {location.displayName.split(',')[0]}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              Today at a Glance
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => refetchEvidence()}
            disabled={isEvidenceLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-700 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white text-xs font-semibold border border-slate-300 dark:border-white/10 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isEvidenceLoading ? 'animate-spin text-cyber-teal' : ''}`} />
            <span>Sync Environmental Feed</span>
          </button>
        </div>
      </div>

      {/* Top Section: Circular Dial + Lively Indian Routine Scene Card */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* Visual Circular AQI Gauge */}
        <CircularAqiGauge
          aqi={Math.round(primaryPm25)}
          pollutant="PM 2.5"
          category={primaryPm25 > 150 ? 'Unhealthy' : primaryPm25 > 50 ? 'Moderate' : 'Good'}
          city={location.displayName}
          temperature="24°C"
          humidity="48%"
          windSpeed="6 km/h"
          isLoading={isEvidenceLoading}
        />

        {/* Visual Active Routine Card with Indian Commute Image */}
        <div className="cyber-card rounded-[28px] overflow-hidden flex flex-col justify-between min-h-[360px] relative group border border-slate-300 dark:border-white/15 shadow-xl">
          <div className="h-44 w-full relative overflow-hidden">
            <img
              src="/assets/indian-morning-routine.jpg"
              alt="Active Morning Routine in Green Urban Park"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider bg-cyber-teal text-slate-950 px-2.5 py-0.5 rounded-full font-display">
                  Active Routine
                </span>
                <span className="text-[11px] font-bold text-white bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">
                  {initialContext?.initialContext?.departureTime || '08:00 AM'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-display">
                Morning Commute & Travel Window
              </h3>
              <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
                Regional CAMS forecast shows surface temperature inversion easing after 09:15 AM.
                One feasible cleaner-air change is ready on your board below.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200 dark:border-white/10">
              <span className="text-[11px] font-semibold bg-white/5 text-slate-700 dark:text-white px-2.5 py-1 rounded-xl border border-slate-200 dark:border-white/10">
                🚗 Car (Petrol)
              </span>
              <span className="text-[11px] font-semibold bg-white/5 text-slate-700 dark:text-white px-2.5 py-1 rounded-xl border border-slate-200 dark:border-white/10">
                ⏱ ±30m Flexibility
              </span>
              <span className="text-[11px] font-bold text-cyber-teal bg-cyber-teal/10 px-2.5 py-1 rounded-xl border border-cyber-teal/30">
                ARAI Verified Factors
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Futuristic Wave Spline Chart */}
      <AirTrendWaveChart records={evidenceBundle?.records || []} />

      {/* Segmented View Pills (Decision Board, Hourly CAMS Forecast, Dispersion Map, Indoor Coach) */}
      <div className="cyber-card p-1.5 rounded-2xl flex flex-wrap gap-1 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('board')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
            activeTab === 'board'
              ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal font-display'
              : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          3-Way Decision Board
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('map')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
            activeTab === 'map'
              ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal font-display'
              : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Dispersion Map
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('forecast')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
            activeTab === 'forecast'
              ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal font-display'
              : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Hourly Forecast
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('indoor')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
            activeTab === 'indoor'
              ? 'bg-cyber-teal text-slate-950 shadow-cyber-glow-teal font-display'
              : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Indoor Air Coach
        </button>
      </div>

      {/* Tab 1: 3-Way Decision Board */}
      {activeTab === 'board' && (
        <div className="space-y-6">
          <DecisionBoard
            candidates={planData?.candidates}
            impactReceipts={planData?.impactReceipts}
            explanation={planData?.explanation}
            reasonCodes={planData?.reasonCodes}
            modelInfo={planData?.model}
            degradedMode={planData?.degradedMode}
          />

          {/* Assistant Replanner Drawer */}
          <ContextualAssistant
            location={location}
            currentBaseline={currentBaseline}
            onRevise={handleReviseConstraint}
            isRevising={isPlanLoading}
          />

          {/* Scientific Assumptions Disclosure */}
          <EvidenceDisclosure />
        </div>
      )}

      {/* Tab 2: Urban Dispersion Map */}
      {activeTab === 'map' && (
        <UrbanAirMap
          selectedCity={location}
          currentPm25={primaryPm25}
        />
      )}

      {/* Tab 3: Forecast Day-Strip */}
      {activeTab === 'forecast' && (
        <div className="cyber-card p-6 sm:p-7 rounded-[32px] space-y-4">
          <PollutantTimeline
            evidenceRecords={evidenceBundle?.records || []}
            pollutant="PM2.5"
            unit="μg/m³"
          />
        </div>
      )}

      {/* Tab 3: Indoor Air Coach */}
      {activeTab === 'indoor' && (
        <div className="cyber-card p-6 sm:p-8 rounded-[32px]">
          <IndoorActionCoach
            householdContext={initialContext?.initialContext}
            outdoorAqi={primaryPm25}
          />
        </div>
      )}
    </div>
  );
}
