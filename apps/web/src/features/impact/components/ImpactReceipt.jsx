import React from 'react';
import { Leaf, Info } from 'lucide-react';

export function ImpactReceipt({ receipt }) {
  if (!receipt) return null;

  const { outdoorContext, indoorAction, emissionsEstimate } = receipt;

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between pb-1 border-b border-stone-200">
        <span className="font-semibold text-stone-800 flex items-center gap-1">
          <Leaf className="w-3.5 h-3.5 text-brand-600" />
          Impact Receipt
        </span>
        <span className="text-[10px] text-stone-400">3 Separate Channels</span>
      </div>

      {/* Channel 1: Outdoor Context */}
      <div>
        <span className="font-medium text-stone-700 block">1. Outdoor Context:</span>
        <span className="text-stone-500 block">
          {outdoorContext?.pollutant} window: {outdoorContext?.timeWindow}
        </span>
      </div>

      {/* Channel 2: Indoor Mechanism */}
      <div>
        <span className="font-medium text-stone-700 block">2. Indoor Mechanism:</span>
        <span className="text-stone-500 block">{indoorAction?.mechanism || 'Source control'}</span>
      </div>

      {/* Channel 3: Emissions Estimate */}
      <div>
        <span className="font-medium text-stone-700 block">3. Emissions Estimate:</span>
        {emissionsEstimate?.status === 'estimated' ? (
          <span className="text-emerald-700 font-medium block">
            ~{emissionsEstimate.estimatedTailpipeCo2GramsSaved}g avoided tailpipe CO₂
          </span>
        ) : (
          <span className="text-stone-400 italic block">Not estimated (no verified factor)</span>
        )}
      </div>

      <div className="pt-1 text-[10px] text-stone-400 flex items-start gap-1">
        <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
        <span>Channels are independent and never combined into a single score.</span>
      </div>
    </div>
  );
}
