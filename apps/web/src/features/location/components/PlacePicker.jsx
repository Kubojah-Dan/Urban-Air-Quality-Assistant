import React from 'react';
import { MapPin } from 'lucide-react';
import { CITIES } from '../api/locationApi.js';

export function PlacePicker({ selectedCity, onSelectCity }) {
  return (
    <div className="flex items-center gap-3">
      <MapPin className="w-5 h-5 text-stone-400 flex-shrink-0" />
      <select
        value={selectedCity?.cityId || 'delhi'}
        onChange={(e) => {
          const found = CITIES.find((c) => c.cityId === e.target.value);
          if (found) onSelectCity(found);
        }}
        className="w-full bg-stone-50 border border-stone-300 rounded-lg py-2.5 px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        {CITIES.map((c) => (
          <option key={c.cityId} value={c.cityId}>
            {c.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}
