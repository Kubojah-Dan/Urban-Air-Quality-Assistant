import React from 'react';
import { MapPin } from 'lucide-react';
import { CITIES } from '../api/locationApi.js';

export function PlacePicker({ selectedCity, onSelectCity, compact = false }) {
  // Group cities by State / Region
  const groupedCities = CITIES.reduce((acc, city) => {
    const group = city.state || (city.countryCode === 'IN' ? 'India' : 'International');
    if (!acc[group]) acc[group] = [];
    acc[group].push(city);
    return acc;
  }, {});

  return (
    <div className="relative flex items-center gap-2 w-full">
      <div className="absolute left-3.5 pointer-events-none text-cyber-teal flex items-center z-10">
        <MapPin className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      </div>
      <select
        value={selectedCity?.cityId || 'delhi'}
        onChange={(e) => {
          const found = CITIES.find((c) => c.cityId === e.target.value);
          if (found) onSelectCity(found);
        }}
        aria-label="Select urban location"
        className={`w-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/15 rounded-2xl ${
          compact ? 'py-1.5 pl-9 pr-3 text-xs' : 'py-3 pl-10 pr-4 text-xs sm:text-sm'
        } font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyber-teal focus:ring-1 focus:ring-cyber-teal transition cursor-pointer shadow-xs`}
      >
        {Object.entries(groupedCities).map(([group, cities]) => (
          <optgroup
            key={group}
            label={group}
            className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white font-bold"
          >
            {cities.map((c) => (
              <option
                key={c.cityId}
                value={c.cityId}
                className="text-slate-900 bg-white dark:bg-slate-900 dark:text-white font-medium"
              >
                {c.displayName}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
