import React, { useState } from 'react';
import { Leaf, Info, ChevronDown, ChevronUp, Shield, Factory, Wind, Sparkles } from 'lucide-react';

/**
 * ImpactReceipt
 *
 * Screen E component: The signature analytical report with 3 separate channels:
 * - Channel 1: Outdoor Air Context (ambient concentration vs inhaled dose boundary)
 * - Channel 2: Indoor Action Mechanism (source control, filtration, ventilation)
 * - Channel 3: Emissions Estimate (tailpipe CO2/PM delta from ARAI 2024 / EPA MOVES 2024)
 * Adaptive crystal-clear contrast in both Light & Dark modes.
 */
export function ImpactReceipt({ receipt }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!receipt) return null;

  const { outdoorContext, indoorAction, emissionsEstimate, assumptions = [], unknowns = [] } = receipt;

  return (
    <div className="p-4 sm:p-5 rounded-[24px] bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3.5 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-white font-display">
          <Leaf className="w-4 h-4 text-cyber-teal flex-shrink-0" />
          <span>Impact Receipt</span>
        </div>
        <span className="text-[10px] bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-cyber-text-secondary px-2.5 py-0.5 rounded-full font-bold border border-slate-300 dark:border-white/15">
          3 Independent Channels
        </span>
      </div>

      <div className="space-y-2.5">
        {/* Channel 1: Outdoor Context */}
        <div className="p-3 bg-white dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyber-blue">
            <Wind className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Channel 1: Outdoor Air Context</span>
          </div>
          <p className="text-slate-900 dark:text-white font-bold">
            {outdoorContext?.windowDescription || 'Scheduled Activity Window'}
          </p>
          <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
            Ambient Pollutant: {outdoorContext?.pollutant} ({Math.round(outdoorContext?.value || 0)} {outdoorContext?.unit})
          </p>
          <p className="text-[10px] text-slate-500 dark:text-cyber-text-muted italic">
            Boundary: Ambient outdoor concentration is not an individual's personal inhaled dose.
          </p>
        </div>

        {/* Channel 2: Indoor Mechanism */}
        <div className="p-3 bg-white dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyber-teal">
            <Shield className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Channel 2: Indoor / In-Cabin Mechanism</span>
          </div>
          <p className="text-slate-900 dark:text-white font-bold">{indoorAction?.actionTitle || 'Indoor Source Control'}</p>
          <span className="inline-block text-[10px] bg-cyber-teal text-slate-950 px-2 py-0.5 rounded-md uppercase font-black font-display">
            Mechanism: {indoorAction?.mechanism?.replace(/_/g, ' ') || 'source control'}
          </span>
          {indoorAction?.avoidWhen?.length > 0 && (
            <p className="text-[10px] text-cyber-amber font-semibold mt-1">
              <strong>Avoid when:</strong> {indoorAction.avoidWhen.join(', ')}
            </p>
          )}
        </div>

        {/* Channel 3: Emissions Estimate */}
        <div className="p-3 bg-white dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/5 space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-cyber-text-secondary">
            <Factory className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Channel 3: Emissions Estimate</span>
          </div>
          {emissionsEstimate?.status === 'estimated' ? (
            <div>
              <p className="text-cyber-teal font-extrabold text-sm font-display">
                ~{emissionsEstimate.estimatedTailpipeCo2GramsSaved}g avoided tailpipe CO₂
              </p>
              <p className="text-[10px] text-slate-600 dark:text-cyber-text-secondary mt-0.5">
                Basis: {emissionsEstimate.basis} • Factor Vintage: {emissionsEstimate.factorVintage || 'ARAI 2024'} ({emissionsEstimate.calculationBoundary})
              </p>
            </div>
          ) : (
            <p className="text-slate-500 dark:text-cyber-text-muted italic text-[11px]">
              {emissionsEstimate?.note || 'Not estimated: reference travel baseline.'}
            </p>
          )}
        </div>
      </div>

      {/* Assumptions & Unknowns Disclosure Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full text-[11px] text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white font-semibold focus:outline-none focus-visible:underline cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 dark:text-cyber-text-muted" />
            <span>Scientific Assumptions & Unknowns ({assumptions.length + unknowns.length})</span>
          </span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDetails && (
          <div className="mt-2 p-3 bg-slate-50 dark:bg-black/50 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2 text-[11px] text-slate-600 dark:text-cyber-text-secondary shadow-xs">
            {assumptions.length > 0 && (
              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Scientific Assumptions:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            {unknowns.length > 0 && (
              <div>
                <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Explicit Unknowns:</span>
                <ul className="list-disc list-inside space-y-0.5">
                  {unknowns.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
