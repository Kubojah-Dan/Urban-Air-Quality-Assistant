import React from 'react';

/**
 * DrawerQuickPrompts Component
 *
 * Horizontal scrollable quick-action chips for common environmental inquiries.
 *
 * @param {Object} props
 * @param {Array<{ label: string, query: string }>} props.prompts
 * @param {boolean} props.isProcessing
 * @param {(query: string) => void} props.onSelectPrompt
 */
export function DrawerQuickPrompts({
  prompts,
  isProcessing,
  onSelectPrompt
}) {
  return (
    <div className="shrink-0 px-3.5 py-2.5 bg-slate-50/90 dark:bg-black/30 border-t border-slate-200/80 dark:border-white/10 overflow-x-auto flex items-center gap-2 no-scrollbar">
      {prompts.map((p, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectPrompt(p.query)}
          disabled={isProcessing}
          className="shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full bg-white dark:bg-white/5 hover:bg-cyber-teal/20 text-slate-700 dark:text-cyber-text-secondary hover:text-cyber-teal border border-slate-200/90 dark:border-white/10 transition cursor-pointer whitespace-nowrap shadow-2xs hover:scale-102"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
