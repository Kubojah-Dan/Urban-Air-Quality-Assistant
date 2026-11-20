import React from 'react';

export function StatusLabel({ status, label }) {
  const styles = {
    valid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    preliminary: 'bg-amber-50 text-amber-700 border-amber-200',
    stale: 'bg-orange-50 text-orange-700 border-orange-200',
    expired: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-0.5 rounded-md border font-medium ${
        styles[status] || 'bg-stone-50 text-stone-600 border-stone-200'
      }`}
    >
      {label || status}
    </span>
  );
}
