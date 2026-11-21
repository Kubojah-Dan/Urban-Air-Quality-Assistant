import React, { useState, useEffect } from 'react';
import { AirEvidenceHeader } from '../../forecast/components/AirEvidenceHeader.jsx';
import { PollutantTimeline } from '../../forecast/components/PollutantTimeline.jsx';
import { RoutineInputForm } from '../components/RoutineInputForm.jsx';
import { DecisionBoard } from '../components/DecisionBoard.jsx';
import { EvidenceDisclosure } from '../../impact/components/EvidenceDisclosure.jsx';
import { ContextualAssistant } from '../../assistant/components/ContextualAssistant.jsx';
import { IndoorActionCoach } from '../../indoor/components/IndoorActionCoach.jsx';
import { useAirEvidence } from '../../forecast/hooks/useAirEvidence.js';
import { useRoutinePlan } from '../hooks/useRoutinePlan.js';
import { ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';

export function TodayPage({ initialContext, onBackToStart }) {
  const location = initialContext?.city || {
    cityId: 'delhi',
    countryCode: 'IN',
    displayName: 'Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timeZone: 'Asia/Kolkata'
  };

  const { data: evidenceBundle, isLoading: isEvidenceLoading, refetch: refetchEvidence } = useAirEvidence(location);
  const { data: planData, isLoading: isPlanLoading, generatePlan, revisePlan } = useRoutinePlan(location);

  const [currentBaseline, setCurrentBaseline] = useState(null);
  const [revisionLog, setRevisionLog] = useState([]);

  // Auto-generate initial plan when mounted with initialContext
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
    75;

  return (
    <div className="space-y-6">
      {/* Top Navigation & Context Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToStart}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-xl hover:bg-stone-50 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Change City or Decision</span>
        </button>

        <button
          type="button"
          onClick={() => {
            refetchEvidence();
            if (currentBaseline) generatePlan(currentBaseline, location);
          }}
          disabled={isEvidenceLoading || isPlanLoading}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isEvidenceLoading || isPlanLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Data</span>
        </button>
      </div>

      {/* Air Evidence & Provenance Header */}
      <AirEvidenceHeader bundle={evidenceBundle} location={location} />

      {/* Real Forecast Day-Strip Timeline & Accessible Table Alternative */}
      <PollutantTimeline
        records={evidenceBundle?.records || []}
        attribution="Copernicus CAMS Numerical Model"
      />

      {/* Main 2-Column Responsive Workspace */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Context Form, Contextual Replanner, Indoor Coach */}
        <div className="lg:col-span-1 space-y-6">
          <RoutineInputForm
            initialValues={{
              activityName:
                initialContext?.task === 'outdoor' ? 'Outdoor Exercise / Errand' : 'Daily Work Commute',
              departureTime: initialContext?.initialContext?.departureTime || '08:00',
              deadlineTime: initialContext?.initialContext?.deadlineTime || '09:00',
              transitFeasible: initialContext?.initialContext?.transitFeasible
            }}
            onSubmit={handleCreatePlan}
            isLoading={isPlanLoading}
          />

          <ContextualAssistant
            onReviseConstraint={handleReviseConstraint}
            isLoading={isPlanLoading}
            revisionLog={revisionLog}
          />

          <IndoorActionCoach outdoorPm25={primaryPm25} />
        </div>

        {/* Right Column: Hero Decision Board & Scientific Caveats */}
        <div className="lg:col-span-2 space-y-6">
          <DecisionBoard
            candidates={planData?.candidates}
            impactReceipts={planData?.impactReceipts}
            explanation={planData?.explanation}
            reasonCodes={planData?.reasonCodes}
            modelInfo={planData?.modelInfo}
            degradedMode={planData?.degradedMode}
          />

          <EvidenceDisclosure limitations={evidenceBundle?.limitations} />
        </div>
      </div>
    </div>
  );
}
