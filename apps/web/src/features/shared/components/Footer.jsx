import React from 'react';
import { ShieldCheck, Database, Sparkles, MapPin, ExternalLink, Heart } from 'lucide-react';

export function Footer({ onChangeTab }) {
  const navLinks = [
    { id: 'landing', label: 'Overview' },
    { id: 'today', label: 'Today Dashboard' },
    { id: 'routine', label: 'My Routine' },
    { id: 'indoor', label: 'Indoor Air' },
    { id: 'explorer', label: 'Air Quality Explorer' },
    { id: 'history', label: 'Impact History' },
    { id: 'assistant', label: 'AI Assistant' },
    { id: 'privacy', label: 'Privacy & DPDP Rights' }
  ];

  return (
    <footer className="mt-16 border-t border-slate-200/80 dark:border-white/10 pt-10 pb-20 md:pb-10 transition-colors">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        {/* Top Grid: Brand + Links + Provenance */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-4">
          {/* Col 1: Brand & Logo */}
          <div className="space-y-3 md:col-span-1">
            <div
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => onChangeTab && onChangeTab('landing')}
            >
              <img
                src="/dayshift-logo.svg"
                alt="DayShift Logo"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed font-medium">
              Your day. Your choices. Cleaner air. Constraint-aware AI routine guidance calibrated for Indian metros and modern households.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-teal-800 dark:text-cyber-teal font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 2.5 Flash + Groq Powered</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white font-display">
              Platform
            </h4>
            <ul className="space-y-1.5 text-xs">
              {navLinks.slice(0, 4).map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onChangeTab && onChangeTab(link.id)}
                    className="text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white transition cursor-pointer font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Intelligence & Analytics */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white font-display">
              Explore & AI
            </h4>
            <ul className="space-y-1.5 text-xs">
              {navLinks.slice(4).map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => onChangeTab && onChangeTab(link.id)}
                    className="text-slate-600 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white transition cursor-pointer font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Scientific Provenance */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white font-display">
              Scientific Sources
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-600 dark:text-cyber-text-secondary font-medium">
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-cyber-blue shrink-0" />
                <span>Copernicus CAMS & CPCB Stations</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyber-teal shrink-0" />
                <span>ARAI 2024 & EPA MOVES Factors</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyber-purple shrink-0" />
                <span>28 Indian States & All Major Cities</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-cyber-text-muted">
          <div className="flex items-center gap-2 font-medium">
            <span>© {new Date().getFullYear()} DayShift. All rights reserved.</span>
            <span>•</span>
            <span className="text-teal-700 dark:text-cyber-teal font-semibold">DPDP Act 2023 Compliant</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Zero Continuous GPS Tracking</span>
            <span>•</span>
            <button
              type="button"
              onClick={() => onChangeTab && onChangeTab('privacy')}
              className="hover:underline text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
            >
              Right to Portability & Erasure
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
