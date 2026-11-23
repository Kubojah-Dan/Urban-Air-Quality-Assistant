import React, { useState } from 'react';
import {
  Clock,
  Plus,
  ArrowRight,
  ShieldCheck,
  Car,
  Train,
  Bike,
  Wind,
  Sparkles,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Edit3,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { RouteComparison } from '../components/RouteComparison.jsx';

/**
 * RoutinePage
 *
 * Feature One: Smart Daily Routine Optimizer.
 * Introduces 3 comparison options:
 * - 1. My Usual Routine (Baseline)
 * - 2. Recommended Routine (Air-quality & Exposure optimized)
 * - 3. Alternative Routine (Transit-shifted / Low-emission backup)
 *
 * Organized into: Morning, Afternoon, Evening, Night.
 * With actionable Accept, Reject, Edit, and Regenerate controls.
 */
export function RoutinePage({ initialContext, onSwitchToToday }) {
  const [activePlanType, setActivePlanType] = useState('recommended'); // 'usual' | 'recommended' | 'alternative'
  const [activeSegment, setActiveSegment] = useState('all'); // 'all' | 'morning' | 'afternoon' | 'evening' | 'night'
  const [acceptedSteps, setAcceptedSteps] = useState([1, 2, 4]);
  const [rejectedSteps, setRejectedSteps] = useState([]);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const activeCity = initialContext?.city?.displayName || 'Delhi, India';

  const segments = [
    { id: 'all', label: 'All Day' },
    { id: 'morning', label: 'Morning (06:00 - 12:00)' },
    { id: 'afternoon', label: 'Afternoon (12:00 - 17:00)' },
    { id: 'evening', label: 'Evening (17:00 - 21:00)' },
    { id: 'night', label: 'Night (21:00 - 06:00)' }
  ];

  const routineItems = [
    {
      id: 1,
      segment: 'morning',
      time: '07:30 AM',
      title: 'Morning Work Commute',
      usual: {
        action: 'Drive solo by petrol car with windows down at 08:30 AM',
        emissions: '2,880g CO₂',
        timeImpact: '45 mins',
        cost: '₹140 petrol',
        convenience: 'High convenience, peak traffic stress'
      },
      recommended: {
        action: 'Leave 30 mins earlier (08:00 AM) with AC on recirculation',
        why: 'Morning thermal inversion traps ground-level particulates between 08:30 and 09:30 AM. Leaving 30 mins earlier avoids dense arterial plumes.',
        evidence: 'Copernicus CAMS diurnal inversion boundary modeling + ARAI 2024 emission registry',
        evidenceType: 'CAMS Forecast Model',
        emissionsDelta: 'No tailpipe increase',
        timeDelta: '0 min net travel delay (arrives early at 08:45 AM)',
        costDelta: 'Same fuel cost',
        convenienceTradeoff: 'Requires waking 30m earlier; saves 15 mins congestion delay'
      },
      alternative: {
        action: 'Shift to Metro Rail line + 7-min shaded walk',
        why: 'Electric underground rolling stock bypasses ground traffic and diesel exhaust entirely.',
        evidence: 'CPCB roadside vs Metro station indoor PM2.5 monitoring',
        evidenceType: 'Observed Telemetry',
        emissionsDelta: 'Avoids ~2,650g CO₂ (ARAI 2024)',
        timeDelta: '-5 min travel time',
        costDelta: 'Saves ₹90 per round trip',
        convenienceTradeoff: 'Requires 7-min walking; avoids traffic jams'
      }
    },
    {
      id: 2,
      segment: 'morning',
      time: '10:30 AM',
      title: 'Morning Coffee / Outdoor Break',
      usual: {
        action: 'Roadside sidewalk tea kiosk on arterial road',
        emissions: '0g CO₂',
        timeImpact: '15 mins',
        cost: '₹20',
        convenience: 'Directly curbside'
      },
      recommended: {
        action: 'Use interior courtyard or tree-shaded venue 80m from traffic',
        why: 'Curbside coarse particulate concentration drops steeply 50-80 meters away from arterial road lanes.',
        evidence: 'EPA roadside dispersion gradient literature (50m boundary effect)',
        evidenceType: 'Peer-Reviewed Dispersion Gradient',
        emissionsDelta: 'Zero emissions',
        timeDelta: '+2 min walk',
        costDelta: 'No cost delta',
        convenienceTradeoff: 'Slightly further walk, significantly lower noise and diesel odor'
      },
      alternative: {
        action: 'Indoor ventilated cafeteria with mechanical filtration',
        why: 'Complete protection from ambient roadway particulates.',
        evidence: 'WHO indoor source-control protocols',
        evidenceType: 'Scientific Guidance',
        emissionsDelta: 'Zero emissions',
        timeDelta: '0 min',
        costDelta: 'No change',
        convenienceTradeoff: 'No outdoor fresh air'
      }
    },
    {
      id: 3,
      segment: 'afternoon',
      time: '01:30 PM',
      title: 'Lunchtime Ventilation & Walk',
      usual: {
        action: 'Keep home/office completely sealed all day',
        emissions: '0g',
        timeImpact: '0 mins',
        cost: '₹0',
        convenience: 'Passive'
      },
      recommended: {
        action: 'Open opposite windows for 20-30 minutes for cross-ventilation',
        why: 'Solar heating expands the planetary boundary layer, resulting in the day’s lowest ambient PM2.5 levels. Purges indoor CO2 without high particulate penalty.',
        evidence: 'Copernicus CAMS daytime boundary layer height observations',
        evidenceType: 'Observed + Forecast',
        emissionsDelta: 'Zero emissions',
        timeDelta: '2 mins to open/close',
        costDelta: 'Zero cost',
        convenienceTradeoff: 'Minimal effort; must close windows before 04:30 PM evening buildup'
      },
      alternative: {
        action: 'Run mechanical HEPA filtration on medium speed continuously',
        why: 'Ideal if pollen or local construction dust is present near windows.',
        evidence: 'Mechanical filtration CADR performance benchmarks',
        evidenceType: 'Estimate',
        emissionsDelta: '~15g CO2 (electricity grid equivalent)',
        timeDelta: '0 min',
        costDelta: '₹3 electricity per day',
        convenienceTradeoff: 'Zero manual intervention'
      }
    },
    {
      id: 4,
      segment: 'evening',
      time: '06:15 PM',
      title: 'Evening Return Commute',
      usual: {
        action: 'Drive solo in peak stop-and-go congestion 06:15 - 07:20 PM',
        emissions: '3,100g CO₂',
        timeImpact: '65 mins',
        cost: '₹150 petrol',
        convenience: 'High initial convenience, heavy fatigue'
      },
      recommended: {
        action: 'Depart at 06:45 PM or shift to Metro transit',
        why: '30-minute departure delay bypasses peak bottleneck crawl, reducing vehicle idling time and brake dust exposure.',
        evidence: 'TomTom & CPCB peak congestion curves for metro corridors',
        evidenceType: 'Observed Telemetry',
        emissionsDelta: 'Avoids ~600g CO₂ from reduced idling',
        timeDelta: '-15 mins in vehicle congestion',
        costDelta: 'Saves ₹25 fuel',
        convenienceTradeoff: 'Requires staying at work or venue 30 mins later'
      },
      alternative: {
        action: 'Carpool with colleague or take Metro Rail',
        why: 'Cuts per-passenger emissions by 50-80% while avoiding driving stress.',
        evidence: 'ARAI 2024 passenger occupancy factors',
        evidenceType: 'ARAI 2024 Factor',
        emissionsDelta: 'Avoids ~1,500g CO₂',
        timeDelta: 'Same 45 mins',
        costDelta: 'Splits fuel cost in half',
        convenienceTradeoff: 'Requires coordinating departure time with co-commuter'
      }
    }
  ];

  const filteredItems = routineItems.filter(
    (item) => activeSegment === 'all' || item.segment === activeSegment
  );

  const handleAccept = (id) => {
    setRejectedSteps((prev) => prev.filter((s) => s !== id));
    setAcceptedSteps((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleReject = (id) => {
    setAcceptedSteps((prev) => prev.filter((s) => s !== id));
    setRejectedSteps((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      setAcceptedSteps([1, 2, 3, 4]);
      setRejectedSteps([]);
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display block">
            Smart Daily Routine Optimizer
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            My Daily Routine
          </h1>
          <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-0.5">
            Compare your baseline habits against air-quality optimized recommendations for {activeCity.split(',')[0]}.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white text-xs font-bold border border-slate-300 dark:border-white/10 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-cyber-teal' : ''}`} />
            <span>{isRegenerating ? 'Recalculating...' : 'Regenerate'}</span>
          </button>

          {onSwitchToToday && (
            <button
              type="button"
              onClick={onSwitchToToday}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-cyber-teal text-slate-950 font-black text-xs shadow-cyber-glow-teal hover:opacity-95 transition cursor-pointer"
            >
              <span>Today's Board</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Routine Comparison 3-Way Selector */}
      <div className="cyber-card p-2 rounded-[24px] grid grid-cols-3 gap-1.5 shadow-sm">
        <button
          type="button"
          onClick={() => setActivePlanType('usual')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
            activePlanType === 'usual'
              ? 'bg-slate-800 text-white dark:bg-white/20 dark:text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="block text-[10px] uppercase opacity-75">1. Baseline</span>
          <span>My Usual Routine</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePlanType('recommended')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
            activePlanType === 'recommended'
              ? 'bg-cyber-teal text-slate-950 font-black shadow-cyber-glow-teal'
              : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="block text-[10px] uppercase opacity-75">2. Recommended</span>
          <span>Optimal Clean-Air</span>
        </button>

        <button
          type="button"
          onClick={() => setActivePlanType('alternative')}
          className={`py-2.5 px-3 rounded-xl text-xs font-bold transition text-center cursor-pointer ${
            activePlanType === 'alternative'
              ? 'bg-sky-500 text-white dark:bg-cyber-blue dark:text-slate-950 font-black shadow-xs'
              : 'text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <span className="block text-[10px] uppercase opacity-75">3. Backup</span>
          <span>Alternative Route</span>
        </button>
      </div>

      {/* Time-of-Day Segment Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {segments.map((seg) => (
          <button
            key={seg.id}
            type="button"
            onClick={() => setActiveSegment(seg.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 border ${
              activeSegment === seg.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-transparent shadow-xs'
                : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {seg.label}
          </button>
        ))}
      </div>

      {/* Routine Cards List */}
      <div className="space-y-4">
        {filteredItems.map((step) => {
          const isAccepted = acceptedSteps.includes(step.id);
          const isRejected = rejectedSteps.includes(step.id);

          const currentPlan =
            activePlanType === 'usual'
              ? step.usual
              : activePlanType === 'alternative'
              ? step.alternative
              : step.recommended;

          return (
            <div
              key={step.id}
              className={`cyber-card p-5 sm:p-6 rounded-[28px] space-y-4 border transition-all ${
                isAccepted && activePlanType !== 'usual'
                  ? 'border-cyber-teal/50 ring-1 ring-cyber-teal/20'
                  : isRejected
                  ? 'border-rose-400/40 opacity-75'
                  : 'border-slate-200 dark:border-white/10'
              }`}
            >
              {/* Card Top: Number, Title, Segment & State */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyber-teal text-slate-950 font-black text-xs flex items-center justify-center font-display shadow-cyber-glow-teal shrink-0">
                    {step.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                        {step.title}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-cyber-text-secondary bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10">
                        {step.time}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-cyber-text-muted capitalize">
                      Segment: {step.segment}
                    </span>
                  </div>
                </div>

                {/* Acceptance Status Badge */}
                {activePlanType !== 'usual' && (
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    {isAccepted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-teal-800 dark:text-cyber-teal bg-teal-50 dark:bg-cyber-teal/15 px-2.5 py-1 rounded-full border border-teal-200 dark:border-cyber-teal/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accepted</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/15 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-500/30">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Kept Usual</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Banner */}
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  activePlanType === 'recommended'
                    ? 'bg-teal-500/10 dark:bg-cyber-teal/10 border-cyber-teal/30'
                    : activePlanType === 'alternative'
                    ? 'bg-sky-500/10 dark:bg-cyber-blue/10 border-cyber-blue/30'
                    : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10'
                }`}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-cyber-teal shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-500 dark:text-cyber-text-muted block">
                      {activePlanType === 'usual' ? 'Usual Action' : 'DayShift Action Proposal'}
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {activePlanType === 'usual' ? currentPlan.action : currentPlan.action}
                    </p>
                  </div>
                </div>

                {/* Why DayShift Recommends It */}
                {currentPlan.why && (
                  <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                      Why DayShift Recommends This:
                    </span>
                    <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
                      {currentPlan.why}
                    </p>
                  </div>
                )}

                {/* Environmental Evidence Basis */}
                {currentPlan.evidence && (
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px]">
                    <span className="font-bold text-slate-700 dark:text-white">Evidence Basis:</span>
                    <span className="bg-white/70 dark:bg-black/30 px-2 py-0.5 rounded text-slate-800 dark:text-cyber-teal font-mono border border-slate-200 dark:border-white/5">
                      {currentPlan.evidenceType}
                    </span>
                    <span className="text-slate-500 dark:text-cyber-text-secondary truncate">
                      {currentPlan.evidence}
                    </span>
                  </div>
                )}
              </div>

              {/* Trade-offs Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-cyber-text-muted">
                    ⏱ Travel Time Impact
                  </span>
                  <p className="font-extrabold text-slate-900 dark:text-white">
                    {activePlanType === 'usual' ? currentPlan.timeImpact : currentPlan.timeDelta}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-cyber-text-muted">
                    🌿 Emissions & Cost
                  </span>
                  <p className="font-extrabold text-emerald-600 dark:text-cyber-teal">
                    {activePlanType === 'usual' ? currentPlan.emissions : currentPlan.emissionsDelta}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-cyber-text-muted">
                    ⚖️ Convenience Trade-off
                  </span>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    {activePlanType === 'usual' ? currentPlan.convenience : currentPlan.convenienceTradeoff}
                  </p>
                </div>
              </div>

              {/* User Action Controls */}
              {activePlanType !== 'usual' && (
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => handleReject(step.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-cyber-text-secondary hover:bg-slate-100 dark:hover:bg-white/5 transition cursor-pointer"
                  >
                    Reject / Keep Usual
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAccept(step.id)}
                    className="px-4 py-1.5 rounded-xl bg-cyber-teal text-slate-950 text-xs font-black shadow-cyber-glow-teal hover:opacity-95 transition cursor-pointer"
                  >
                    {isAccepted ? 'Accepted ✓' : 'Accept Recommendation'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Air-Aware Route Comparison Section */}
      <RouteComparison selectedCity={activeCity} />
    </div>
  );
}
