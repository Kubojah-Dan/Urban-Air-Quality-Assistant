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
      <div className="cyber-card rounded-[32px] p-8 text-center space-y-2">
        <h3 className="font-bold text-white text-base font-display">No Active Routine Plan Yet</h3>
        <p className="text-xs text-cyber-text-secondary max-w-md mx-auto">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display block">
            Core Decision Interface
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
            Today’s 3-Way Decision Board
          </h2>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs text-cyber-text-secondary bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-cyber-purple" />
          <span className="text-white text-[11px]">{providerLabel}</span>
          {modelInfo?.fallbackTriggered && (
            <span className="text-[10px] bg-cyber-amber/20 text-cyber-amber px-1.5 py-0.2 rounded font-semibold">
              Failover Active
            </span>
          )}
        </div>
      </div>

      {/* AI Contextual Explanation Banner */}
      {explanation && (
        <div className="p-5 cyber-card rounded-[28px] space-y-2 border-cyber-teal/30">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Sparkles className="w-4 h-4 text-cyber-teal flex-shrink-0" />
            <span className="font-display">Contextual AI Trade-off Analysis</span>
          </div>
          <p className="text-xs text-cyber-text-secondary leading-relaxed">{explanation}</p>
          {reasonCodes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {reasonCodes.map((code, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-white/10 text-white font-semibold px-2.5 py-0.5 rounded-full border border-white/15"
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
        <div className="p-4 bg-cyber-amber/15 border border-cyber-amber/30 rounded-[28px] flex items-start gap-2.5 text-xs text-white">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyber-amber" />
          <div>
            <span className="font-bold block">Operating in Verified Deterministic Mode</span>
            <span className="text-[11px] text-cyber-text-secondary leading-relaxed block">
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
