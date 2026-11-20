import React from 'react';
import { AirEvidenceHeader } from '../../forecast/components/AirEvidenceHeader.jsx';
import { PollutantTimeline } from '../../forecast/components/PollutantTimeline.jsx';
import { RoutineInputForm } from '../components/RoutineInputForm.jsx';
import { DecisionBoard } from '../components/DecisionBoard.jsx';
import { EvidenceDisclosure } from '../../impact/components/EvidenceDisclosure.jsx';
import { ContextualAssistant } from '../../assistant/components/ContextualAssistant.jsx';
import { IndoorActionCoach } from '../../indoor/components/IndoorActionCoach.jsx';
import { useAirEvidence } from '../../forecast/hooks/useAirEvidence.js';
import { useRoutinePlan } from '../hooks/useRoutinePlan.js';

export function TodayPage({ initialContext }) {
  const location = initialContext?.city || {
    cityId: 'delhi',
    countryCode: 'IN',
    displayName: 'Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090
  };

  const { data: evidenceBundle } = useAirEvidence(location);
  const { data: planData, isLoading, generatePlan, revisePlan } = useRoutinePlan(location);
  const [currentBaseline, setCurrentBaseline] = React.useState(null);

  const handleCreatePlan = (baseline) => {
    setCurrentBaseline(baseline);
    generatePlan(baseline, location);
  };

  const handleReviseConstraint = (modifiedConstraint) => {
    if (currentBaseline) {
      revisePlan(currentBaseline, modifiedConstraint, location);
    }
  };

  return (
    <div className="space-y-6">
      <AirEvidenceHeader bundle={evidenceBundle} location={location} />
      <PollutantTimeline />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <RoutineInputForm onSubmit={handleCreatePlan} isLoading={isLoading} />
          <ContextualAssistant onReviseConstraint={handleReviseConstraint} />
          <IndoorActionCoach />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <DecisionBoard
            candidates={planData?.candidates}
            impactReceipts={planData?.impactReceipts}
          />
          <EvidenceDisclosure limitations={evidenceBundle?.limitations} />
        </div>
      </div>
    </div>
  );
}
