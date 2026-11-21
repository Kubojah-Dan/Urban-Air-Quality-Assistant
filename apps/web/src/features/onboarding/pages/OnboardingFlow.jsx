import React, { useState } from 'react';
import { PlacePicker } from '../../location/components/PlacePicker.jsx';
import { ArrowRight, ArrowLeft, Check, Compass, Clock, Car, Wind, UserCheck, Sparkles } from 'lucide-react';

export function OnboardingFlow({ onComplete, onCancel }) {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [selectedCity, setSelectedCity] = useState({
    countryCode: 'IN',
    cityId: 'delhi',
    displayName: 'Delhi, India',
    latitude: 28.6139,
    longitude: 77.2090,
    timeZone: 'Asia/Kolkata'
  });

  const [commuteMode, setCommuteMode] = useState('car_petrol');
  const [departureTime, setDepartureTime] = useState('08:00');
  const [deadlineTime, setDeadlineTime] = useState('09:00');
  const [flexibility, setFlexibility] = useState(30);
  const [hasVentedHood, setHasVentedHood] = useState(true);
  const [hasAirPurifier, setHasAirPurifier] = useState(false);
  const [hasSensitiveAirways, setHasSensitiveAirways] = useState(false);

  const transitModes = [
    { id: 'car_petrol', label: 'Car (Petrol)', icon: '🚗' },
    { id: 'car_diesel', label: 'Car (Diesel)', icon: '🚙' },
    { id: 'ev', label: 'Electric Vehicle', icon: '⚡' },
    { id: 'two_wheeler', label: 'Two-Wheeler (Motorcycle/Scooter)', icon: '🛵' },
    { id: 'metro', label: 'Metro / Rail', icon: '🚇' },
    { id: 'bus', label: 'City Bus', icon: '🚌' },
    { id: 'walk_cycle', label: 'Walking / Cycling', icon: '🚲' }
  ];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete({
        task: 'commute',
        city: selectedCity,
        initialContext: {
          departureTime,
          deadlineTime,
          transitFeasible: true,
          hasVentedHood,
          commuteMode,
          flexibility,
          hasAirPurifier,
          hasSensitiveAirways
        }
      });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Progress Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-cyber-text-secondary">
          <span>Step {step} of {totalSteps}</span>
          <span className="text-cyber-teal font-bold">{Math.round((step / totalSteps) * 100)}% Completed</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 p-0.5 border border-white/15">
          <div
            className="h-full rounded-full bg-cyber-teal transition-all duration-300 shadow-cyber-glow-teal"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Cyber Card Container */}
      <div className="cyber-card-elevated p-6 sm:p-8 rounded-[32px] space-y-6 relative">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
                Location Planning
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Select your urban area
              </h2>
              <p className="text-xs text-cyber-text-secondary leading-relaxed">
                DayShift uses coarse city-level resolution for regional atmospheric modeling. We never track your real-time GPS.
              </p>
            </div>

            <div className="pt-2">
              <PlacePicker selectedCity={selectedCity} onSelectCity={setSelectedCity} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
                Transportation
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                How do you usually travel?
              </h2>
              <p className="text-xs text-cyber-text-secondary leading-relaxed">
                Used to compute tailpipe emission baselines via ARAI 2024 and EPA MOVES 2024 registries.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {transitModes.map((mode) => {
                const isSelected = commuteMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setCommuteMode(mode.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyber-teal/20 border-cyber-teal shadow-cyber-glow-teal font-bold text-white'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-cyber-text-secondary'
                    }`}
                  >
                    <span className="text-xl">{mode.icon}</span>
                    <span className="text-xs">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
                Timing & Schedule
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                When do you need to travel?
              </h2>
              <p className="text-xs text-cyber-text-secondary leading-relaxed">
                Helps identify whether shifting your travel window can avoid peak atmospheric inversion hours.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-cyber-text-secondary block">
                  Usual Departure Time
                </label>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-sm font-bold text-white focus:outline-none focus:border-cyber-teal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-cyber-text-secondary block">
                  Latest Arrival Deadline
                </label>
                <input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl p-3 text-sm font-bold text-white focus:outline-none focus:border-cyber-teal"
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-cyber-text-secondary block">
                Schedule Flexibility: {flexibility} minutes
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 15, 30, 45].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setFlexibility(mins)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      flexibility === mins
                        ? 'bg-cyber-teal text-slate-950 border-cyber-teal shadow-cyber-glow-teal'
                        : 'bg-white/5 border-white/10 text-cyber-text-secondary hover:bg-white/10'
                    }`}
                  >
                    {mins === 0 ? 'Fixed' : `±${mins}m`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
                Home Environment
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Your indoor air setup
              </h2>
              <p className="text-xs text-cyber-text-secondary leading-relaxed">
                Enables peer-reviewed WHO/EPA indoor source-control and ventilation recommendations.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label
                onClick={() => setHasVentedHood(!hasVentedHood)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer ${
                  hasVentedHood ? 'bg-white/10 border-cyber-teal shadow-cyber-glow-teal' : 'bg-white/5 border-white/10'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-white block">
                    Kitchen Range Hood / Exhaust Fan
                  </span>
                  <span className="text-[11px] text-cyber-text-secondary">
                    Vented directly to the building exterior
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${hasVentedHood ? 'bg-cyber-teal border-cyber-teal text-slate-950 font-bold' : 'border-white/20'}`}>
                  {hasVentedHood && <Check className="w-3.5 h-3.5" />}
                </div>
              </label>

              <label
                onClick={() => setHasAirPurifier(!hasAirPurifier)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer ${
                  hasAirPurifier ? 'bg-white/10 border-cyber-teal shadow-cyber-glow-teal' : 'bg-white/5 border-white/10'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-white block">
                    Indoor HEPA Air Purifier
                  </span>
                  <span className="text-[11px] text-cyber-text-secondary">
                    Active in bedroom or living area
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${hasAirPurifier ? 'bg-cyber-teal border-cyber-teal text-slate-950 font-bold' : 'border-white/20'}`}>
                  {hasAirPurifier && <Check className="w-3.5 h-3.5" />}
                </div>
              </label>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
                Profile & Health Focus
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Finalizing your preferences
              </h2>
              <p className="text-xs text-cyber-text-secondary leading-relaxed">
                We protect your privacy under the DPDP Act 2023. These preferences are stored locally in your browser.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <label
                onClick={() => setHasSensitiveAirways(!hasSensitiveAirways)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition cursor-pointer ${
                  hasSensitiveAirways ? 'bg-white/10 border-cyber-amber shadow-cyber-glow-amber' : 'bg-white/5 border-white/10'
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-white block">
                    Sensitive Airways or Family Focus
                  </span>
                  <span className="text-[11px] text-cyber-text-secondary">
                    Prioritize cleaner air options even when travel time is slightly longer
                  </span>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${hasSensitiveAirways ? 'bg-cyber-amber border-cyber-amber text-slate-950 font-bold' : 'border-white/20'}`}>
                  {hasSensitiveAirways && <Check className="w-3.5 h-3.5" />}
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-cyber-text-secondary hover:text-white transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyber-teal text-slate-950 font-black text-xs shadow-cyber-glow-teal hover:opacity-95 transition-all cursor-pointer"
          >
            <span>{step === totalSteps ? 'View Today’s Plan' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
