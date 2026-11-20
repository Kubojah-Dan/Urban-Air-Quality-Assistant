import React from 'react';

export function PrivacySettingsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-stone-900">Privacy & Data Governance</h2>
      <div className="bg-white p-6 border border-stone-200 rounded-xl space-y-4 text-sm text-stone-600">
        <p>
          DayShift follows DPDP Act (India) and privacy-by-design standards:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>No Background Geolocation:</strong> We never request continuous GPS.</li>
          <li><strong>Session-Only by Default:</strong> Routines are stored in browser memory only.</li>
          <li><strong>Zero Health Inquiries:</strong> We do not ask for medical history or diagnoses.</li>
        </ul>
      </div>
    </div>
  );
}
