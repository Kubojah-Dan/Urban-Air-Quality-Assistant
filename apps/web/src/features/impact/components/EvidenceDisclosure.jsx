import React from 'react';

export function EvidenceDisclosure({ limitations = [] }) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 space-y-1">
      <h4 className="font-semibold text-stone-800">Evidence Caveats & Scientific Provenance</h4>
      <p>
        Forecast data is provided by numerical models (Copernicus CAMS) representing regional averages
        (~45 km) and not street-level canyon sensors. Air quality data does not equate to personal inhaled
        dose.
      </p>
      {limitations.length > 0 && (
        <ul className="list-disc pl-4 space-y-0.5 text-stone-500 mt-2">
          {limitations.map((lim, idx) => (
            <li key={idx}>{lim}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
