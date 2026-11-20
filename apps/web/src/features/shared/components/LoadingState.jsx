import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading evidence...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
      <span className="text-sm text-stone-500 mt-2">{message}</span>
    </div>
  );
}
