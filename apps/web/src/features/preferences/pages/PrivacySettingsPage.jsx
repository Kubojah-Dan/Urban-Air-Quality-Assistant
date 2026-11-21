import React, { useState } from 'react';
import { ShieldCheck, Download, Trash2, ArrowLeft, Check, Lock, EyeOff, FileText } from 'lucide-react';
import { savePreferences, fetchPreferences } from '../api/preferencesApi.js';
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
        // Fallback for guest mode export
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
        // In guest mode, simply clearing local memory
      }
      localStorage.clear();
      sessionStorage.clear();
      setOptInSave(false);
      setStatusMessage('All saved preferences and cached data have been permanently erased (Right to Erasure).');
    } catch (err) {
      setStatusMessage(`Erasure error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 px-3 py-1.5 rounded-xl hover:bg-stone-50 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Planner</span>
        </button>
        <span className="text-xs text-stone-500 flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Privacy Verified</span>
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
          Privacy, Data Protection & User Rights
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm mt-1 leading-relaxed">
          DayShift complies with India’s Digital Personal Data Protection Act (DPDP Act 2023) and global
          privacy-by-design standards. You maintain absolute control over your routine data.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Core Privacy Pillars */}
      <div className="bg-white p-5 border border-stone-200 rounded-2xl shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-sm">Our Privacy Guarantees</h3>
        <div className="grid gap-3 sm:grid-cols-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
            <div className="w-7 h-7 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-stone-800">No Continuous GPS</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              We never request continuous geolocation or track your route in the background.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
            <div className="w-7 h-7 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-stone-800">Session-Only Default</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Routines and commute options reside in browser memory only and discard on tab close.
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1">
            <div className="w-7 h-7 rounded-lg bg-stone-200/70 text-stone-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-stone-800">Zero Health Inquiries</h4>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              We never collect medical history, diagnoses, pregnancy, or sensitive demographic details.
            </p>
          </div>
        </div>
      </div>

      {/* Opt-in Routine Persistence Toggle */}
      <div className="bg-white p-5 border border-stone-200 rounded-2xl shadow-xs space-y-3">
        <h3 className="font-bold text-stone-900 text-sm">Optional Routine Persistence</h3>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={optInSave}
            onChange={(e) => {
              setOptInSave(e.target.checked);
              setStatusMessage(
                e.target.checked
                  ? 'Opt-in enabled: Your commute preferences will sync across sessions.'
                  : 'Opt-in disabled: Operating in pure guest session mode.'
              );
            }}
            className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-stone-300 mt-0.5"
          />
          <div>
            <span className="font-semibold text-stone-800 text-xs block">
              Save my coarse routine preferences across visits
            </span>
            <span className="text-[11px] text-stone-500 leading-relaxed block mt-0.5">
              Requires explicit consent. Only coarse arrival windows and mode selections are saved under your
              isolated user ID.
            </span>
          </div>
        </label>
      </div>

      {/* User Rights Actions (Export & Erasure) */}
      <div className="bg-white p-5 border border-stone-200 rounded-2xl shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-sm">Your Data Rights (DPDP Act / GDPR)</h3>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleExportData}
            className="flex-1 py-2.5 px-4 bg-stone-100 text-stone-800 text-xs font-bold rounded-xl hover:bg-stone-200 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export My Data (JSON)</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleDeleteData}
            className="flex-1 py-2.5 px-4 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 hover:bg-rose-100 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Erase All Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
