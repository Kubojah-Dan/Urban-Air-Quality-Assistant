import React from 'react';
import { OptionCard } from './OptionCard.jsx';
import { Sparkles, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export function DecisionBoard({
  candidates,
  impactReceipts,
  explanation,
  reasonCodes = [],
  modelInfo,
  degradedMode = false
}) {
  if (!candidates) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center space-y-2">
        <h3 className="font-bold text-stone-800 text-base">No Active Routine Plan Yet</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Submit your commute details or quick context above to generate the 3-option decision board.
        </p>
      </div>
    );
  }

  // Format AI provider attribution
  const providerLabel =
    modelInfo?.provider === 'google'
      ? `Google Gemini (${modelInfo.model || 'gemini-2.5-flash'})`
      : modelInfo?.provider === 'groq'
        ? `Groq Fallback (${modelInfo.model || 'openai/gpt-oss-120b'})`
        : 'Deterministic Rules Engine';

  return (
    <section className="space-y-4" aria-label="Today’s Decision Board">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
            Core Decision Interface
          </span>
          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">
            Today’s 3-Way Decision Board
          </h2>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
          <span>{providerLabel}</span>
          {modelInfo?.fallbackTriggered && (
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
              Failover Active
            </span>
          )}
        </div>
      </div>

      {/* AI Contextual Explanation Banner */}
      {explanation && (
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800">
            <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span>Contextual AI Trade-off Analysis</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">{explanation}</p>
          {reasonCodes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {reasonCodes.map((code, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-stone-200/80 text-stone-700 font-semibold px-2 py-0.5 rounded-md"
                >
                  {code.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Degraded Mode Notice */}
      {degradedMode && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
          <div>
            <span className="font-bold block">Operating in Verified Deterministic Mode</span>
            <span className="text-[11px] text-amber-700 leading-relaxed block">
              AI ranking providers were unreachable or timed out. Options are ordered using deterministic
              feasibility rules and regional CAMS air data without compromising safety.
            </span>
          </div>
        </div>
      )}

      {/* 3 Option Cards (Usual, Recommended, Backup) */}
      <div className="grid gap-4 md:grid-cols-3">
        <OptionCard
          candidate={candidates.usual}
          receipt={impactReceipts?.receipt_usual}
          variant="usual"
        />
        <OptionCard
          candidate={candidates.recommended}
          receipt={impactReceipts?.receipt_recommended}
          variant="recommended"
        />
        <OptionCard
          candidate={candidates.backup}
          receipt={impactReceipts?.receipt_backup}
          variant="backup"
        />
      </div>
    </section>
  );
}
