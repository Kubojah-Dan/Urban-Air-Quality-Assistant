import React from 'react';

export function EmptyState({ title = 'No Data Available', message = 'Check back later.' }) {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-stone-200 rounded-xl bg-white">
      <h3 className="font-medium text-stone-900">{title}</h3>
      <p className="text-sm text-stone-500 mt-1">{message}</p>
    </div>
  );
}
