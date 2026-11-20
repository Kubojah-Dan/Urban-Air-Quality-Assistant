import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-800 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        {message && <p className="text-xs mt-1 text-red-700">{message}</p>}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-xs font-semibold underline hover:no-underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
