import React from 'react';

export function PollutantTimeline() {
  // A table alternative alongside visual day-strip
  const hours = [
    { time: '07:00 - 09:00', level: 'Elevated (Peak)', pm: '85 µg/m³' },
    { time: '09:00 - 12:00', level: 'Moderate', pm: '55 µg/m³' },
    { time: '12:00 - 16:00', level: 'Lower (Afternoon Window)', pm: '38 µg/m³' },
    { time: '16:00 - 19:00', level: 'Elevated (Evening Peak)', pm: '78 µg/m³' }
  ];

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
        Day-strip Forecast Window (CAMS Forecast Model)
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {hours.map((h, i) => (
          <div key={i} className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="text-xs font-medium text-stone-600 block">{h.time}</span>
            <span className="text-sm font-bold text-stone-900 block mt-1">{h.pm}</span>
            <span className="text-[10px] text-stone-500">{h.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
