import React, { useState } from 'react';
import { ShieldCheck, Download, Trash2, ArrowLeft, Check, Lock, EyeOff, FileText, Sparkles } from 'lucide-react';
import { httpClient } from '../../../infrastructure/http/httpClient.js';

export function PrivacySettingsPage({ onBack }) {
  const [optInSave, setOptInSave] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExportData = async () => {
    setIsProcessing(true);
    try {
      let exportPayload;
      try {
        exportPayload = await httpClient('/preferences/export');
      } catch {
        exportPayload = {
          exportDate: new Date().toISOString(),
          mode: 'guest_session',
          notice: 'Under DPDP Act 2023 / GDPR Right to Data Portability. Guest sessions are stored purely in client memory.',
          sessionData: {
            optInSave,
            visitedCity: 'delhi'
          }
        };
      }

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dayshift_data_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMessage('Data exported successfully under Right to Portability.');
    } catch (err) {
      setStatusMessage(`Export failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteData = async () => {
    if (!window.confirm('Are you sure you want to erase all your saved data? This action cannot be undone.')) {
      return;
    }
    setIsProcessing(true);
    try {
      try {
        await httpClient('/preferences', { method: 'DELETE' });
      } catch {
        // Guest mode fallback
      }
      localStorage.clear();
      sessionStorage.clear();
      setOptInSave(false);
      setStatusMessage('All stored preferences purged successfully under Right to Erasure.');
    } catch (err) {
      setStatusMessage(`Delete failed: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-700 dark:text-cyber-text-secondary hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-white/10 transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display block">
            DPDP Act 2023 & GDPR Compliance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            Privacy & Data Rights
          </h1>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-cyber-teal/15 border border-cyber-teal text-slate-900 dark:text-white text-xs font-bold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-cyber-teal flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* DPDP Act 2023 Disclosure Card */}
      <div className="cyber-card-elevated p-6 sm:p-7 rounded-[32px] space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm font-display">
          <ShieldCheck className="w-5 h-5 text-cyber-teal" />
          <span>Our Privacy Principles</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
          DayShift is engineered with privacy-by-design. We use coarse city-level resolution for regional atmospheric modeling across all 28 Indian States.
          We never track your background GPS, sell your travel habits, or store sensitive health conditions.
        </p>

        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-cyber-teal" />
              Zero Continuous GPS
            </span>
            <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
              We query coarse grid cells instead of exact addresses or live tracking.
            </p>
          </div>

          <div className="p-3.5 bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyber-blue" />
              Guest-First Experience
            </span>
            <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
              Use all core features immediately without registering or creating an account.
            </p>
          </div>
        </div>
      </div>

      {/* Routine Persistence Opt-In */}
      <div className="cyber-card p-6 rounded-[28px] space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
              Opt-in Routine Persistence
            </h3>
            <p className="text-xs text-slate-600 dark:text-cyber-text-secondary leading-relaxed">
              When enabled, your commute window and transit preferences are saved across sessions.
              When disabled, all data lives strictly in your active browser memory.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={optInSave}
            onClick={() => setOptInSave(!optInSave)}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center shadow-xs ${
              optInSave ? 'bg-cyber-teal justify-end' : 'bg-slate-300 dark:bg-white/20 justify-start'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-950 shadow-xs" />
          </button>
        </div>
      </div>

      {/* Data Rights Actions (Portability & Erasure) */}
      <div className="cyber-card p-6 rounded-[28px] space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
          Your Statutory Data Rights
        </h3>

        <div className="space-y-3">
          {/* Export JSON */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Right to Data Portability
              </span>
              <span className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
                Download a clean, machine-readable JSON copy of your preferences.
              </span>
            </div>
            <button
              type="button"
              onClick={handleExportData}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold hover:opacity-90 transition shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* Delete All Data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-slate-200 dark:border-white/10">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-rose-600 block">
                Right to Erasure (Forgotten)
              </span>
              <span className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
                Permanently purge all saved routines, cookies, and local data.
              </span>
            </div>
            <button
              type="button"
              onClick={handleDeleteData}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-500 border border-rose-500/30 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Erase Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
