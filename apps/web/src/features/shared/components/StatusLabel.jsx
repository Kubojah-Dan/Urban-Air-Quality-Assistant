import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, CloudOff, Info, HelpCircle } from 'lucide-react';

const STATUS_CONFIGS = {
  valid: {
    label: 'Verified Fresh',
    style: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    icon: CheckCircle2
  },
  observation: {
    label: 'Station Observation',
    style: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    icon: CheckCircle2
  },
  model_forecast: {
    label: 'Model Forecast',
    style: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: Info
  },
  forecast: {
    label: 'Model Forecast',
    style: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: Info
  },
  preliminary: {
    label: 'Preliminary Data',
    style: 'bg-amber-50 text-amber-800 border-amber-300',
    icon: AlertTriangle
  },
  stale: {
    label: 'Stale Cached Data',
    style: 'bg-orange-50 text-orange-800 border-orange-300',
    icon: Clock
  },
  no_coverage: {
    label: 'No Station Coverage',
    style: 'bg-stone-100 text-stone-700 border-stone-300',
    icon: HelpCircle
  },
  unavailable: {
    label: 'Source Unavailable',
    style: 'bg-rose-50 text-rose-800 border-rose-300',
    icon: CloudOff
  },
  expired: {
    label: 'Expired',
    style: 'bg-red-50 text-red-800 border-red-300',
    icon: AlertTriangle
  }
};

export function StatusLabel({ status, label }) {
  const config = STATUS_CONFIGS[status] || {
    label: label || status,
    style: 'bg-stone-50 text-stone-700 border-stone-200',
    icon: Info
  };
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full border font-medium ${config.style}`}
    >
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{displayLabel}</span>
    </span>
  );
}
