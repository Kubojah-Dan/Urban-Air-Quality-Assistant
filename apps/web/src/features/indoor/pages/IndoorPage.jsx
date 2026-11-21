import React from 'react';
import { IndoorActionCoach } from '../components/IndoorActionCoach.jsx';
import { ShieldCheck, Wind, CheckCircle2, Leaf, Sun } from 'lucide-react';

export function IndoorPage({ initialContext, outdoorAqi = 18 }) {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display block">
          Household Environmental Safety
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
          Indoor Air Coach
        </h1>
        <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-0.5">
          Reviewed protocols for kitchen exhaust, in-room filtration, Indian houseplants, and emergency CO triggers.
        </p>
      </div>

      {/* Lively Indian Indoor Wellness Hero Banner */}
      <div className="cyber-card rounded-[28px] overflow-hidden border border-slate-300 dark:border-white/15 shadow-xl relative group">
        <div className="aspect-[21/9] sm:aspect-[2.5/1] w-full relative overflow-hidden">
          <img
            src="/assets/indian-indoor-wellness.jpg"
            alt="Contemporary Indian Living Room with Air Purifier and Plants"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-8">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-cyber-teal bg-black/60 px-2.5 py-1 rounded-full border border-cyber-teal/30">
                Source Control & Filtration
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-display">
                Clean Indoor Living for Indian Apartments
              </h2>
              <p className="text-xs text-slate-200 max-w-xl hidden sm:block">
                Pairing source control during tadka cooking with HEPA air purifiers and air-purifying indoor flora (Areca Palm & Sansevieria).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Indoor Action Coach Component */}
      <div className="cyber-card p-6 sm:p-8 rounded-[32px]">
        <IndoorActionCoach
          householdContext={initialContext?.initialContext}
          outdoorAqi={outdoorAqi}
        />
      </div>
    </div>
  );
}
