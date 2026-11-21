import React, { useState } from 'react';
import { Leaf, Info, ChevronDown, ChevronUp, Shield, Factory, Wind } from 'lucide-react';

export function ImpactReceipt({ receipt }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!receipt) return null;

  const { outdoorContext, indoorAction, emissionsEstimate, assumptions = [], unknowns = [] } = receipt;

  return (
    <div className="bg-stone-50 border border-stone-200/90 rounded-xl p-3.5 space-y-3 text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-stone-200">
        <div className="flex items-center gap-1.5 font-bold text-stone-900">
          <Leaf className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Impact Receipt</span>
        </div>
        <span className="text-[10px] bg-stone-200/70 text-stone-700 px-2 py-0.5 rounded-full font-medium">
          3 Separate Channels
        </span>
      </div>

      <div className="space-y-2.5">
        {/* Channel 1: Outdoor Context */}
        <div className="p-2.5 bg-white rounded-lg border border-stone-200/70 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-700">
            <Wind className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            <span>Channel 1: Outdoor Air Context</span>
          </div>
          <p className="text-stone-800 font-medium">
            {outdoorContext?.windowDescription || 'Scheduled Activity Window'}
          </p>
          <p className="text-[11px] text-stone-500">
            Pollutant Context: {outdoorContext?.pollutant} ({Math.round(outdoorContext?.value || 0)} {outdoorContext?.unit})
          </p>
          <p className="text-[10px] text-stone-400 italic">
            Boundary: Ambient outdoor concentration is not converted to personal inhaled dose.
          </p>
        </div>

        {/* Channel 2: Indoor Mechanism */}
        <div className="p-2.5 bg-white rounded-lg border border-stone-200/70 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-700">
            <Shield className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span>Channel 2: Indoor Action Mechanism</span>
          </div>
          <p className="text-stone-800 font-medium">{indoorAction?.actionTitle || 'Indoor Source Control'}</p>
          <span className="inline-block text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded uppercase font-semibold">
            Mechanism: {indoorAction?.mechanism?.replace('_', ' ') || 'source control'}
          </span>
          {indoorAction?.avoidWhen?.length > 0 && (
            <p className="text-[10px] text-amber-700 mt-1">
              <strong>Avoid when:</strong> {indoorAction.avoidWhen.join(', ')}
            </p>
          )}
        </div>

        {/* Channel 3: Emissions Estimate */}
        <div className="p-2.5 bg-white rounded-lg border border-stone-200/70 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-stone-700">
            <Factory className="w-3.5 h-3.5 text-stone-600 flex-shrink-0" />
            <span>Channel 3: Emissions Estimate</span>
          </div>
          {emissionsEstimate?.status === 'estimated' ? (
            <div>
              <p className="text-emerald-700 font-bold text-sm">
                ~{emissionsEstimate.estimatedTailpipeCo2GramsSaved}g avoided tailpipe CO₂
              </p>
              <p className="text-[10px] text-stone-500 mt-0.5">
                Basis: {emissionsEstimate.basis} • Factor Vintage: {emissionsEstimate.factorVintage || 'ARAI 2024'} ({emissionsEstimate.calculationBoundary})
              </p>
            </div>
          ) : (
            <p className="text-stone-500 italic text-[11px]">
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
          className="flex items-center justify-between w-full text-[11px] text-stone-600 hover:text-stone-900 font-semibold focus:outline-none focus-visible:underline cursor-pointer"
        >
          <span className="flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Scientific Assumptions & Unknowns ({assumptions.length + unknowns.length})</span>
          </span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDetails && (
          <div className="mt-2 p-2.5 bg-white rounded-lg border border-stone-200 space-y-2 text-[11px] text-stone-600">
            {assumptions.length > 0 && (
              <div>
                <span className="font-bold text-stone-700 block mb-0.5">Assumptions:</span>
                <ul className="list-disc pl-4 space-y-0.5">
                  {assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {unknowns.length > 0 && (
              <div>
                <span className="font-bold text-stone-700 block mb-0.5">Known Unknowns:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-stone-500">
                  {unknowns.map((u, i) => (
                    <li key={i}>{u}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-[10px] text-stone-400 flex items-center gap-1 pt-1 border-t border-stone-200/60">
        <Info className="w-3 h-3 flex-shrink-0" />
        <span>Channels are independent and never combined into a single synthetic score.</span>
      </div>
    </div>
  );
}
