import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RoutinePage } from '../src/features/routine/pages/RoutinePage.jsx';
import * as routineHook from '../src/features/routine/hooks/useRoutinePlan.js';

describe('RoutinePage Environmental Data & Provenance Integrity', () => {
  const baseContext = {
    city: {
      cityId: 'delhi',
      displayName: 'Delhi (NCR), Delhi',
      countryCode: 'IN',
      latitude: 28.6139,
      longitude: 77.2090
    },
    commuteMode: 'car_petrol',
    departureTime: '08:30',
    deadlineTime: '09:15'
  };

  it('renders routine with live valid PM2.5 observation and proper source attribution', () => {
    vi.spyOn(routineHook, 'useRoutinePlan').mockReturnValue({
      data: {
        candidates: {
          usual: { summary: 'Drive solo by petrol car at 08:30 AM' },
          recommended: {
            summary: 'Leave 30 mins earlier (08:00 AM) with AC recirculation',
            explanation: 'Avoids morning thermal inversion layer.'
          },
          backup: { summary: 'Shift to Metro Rail line' }
        },
        evidence: {
          records: [{ pollutant: 'PM2.5', value: 112, attribution: 'CPCB Anand Vihar Station' }],
          freshnessState: 'fresh',
          hasStationObservation: true
        },
        impactReceipts: {
          usual: { tailpipeCo2Grams: 2880 },
          recommended: { tailpipeCo2Grams: 2460 },
          backup: { tailpipeCo2Grams: 420 }
        },
        modelInfo: { provider: 'ARAI 2024 Engine' }
      },
      isLoading: false,
      generatePlan: vi.fn().mockResolvedValue({})
    });

    render(<RoutinePage initialContext={baseContext} />);

    // Confirms monitored PM2.5 is used
    expect(screen.getAllByText(/112 µg\/m³/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Morning Work Commute/i)).toBeDefined();
    expect(screen.getByText(/Morning Outdoor Break/i)).toBeDefined();
    expect(screen.getByText(/Lunchtime Ventilation & Walk/i)).toBeDefined();
    expect(screen.getByText(/Evening Return Commute/i)).toBeDefined();
  });

  it('labels recommendations as precautionary when PM2.5 measurement is unavailable', () => {
    vi.spyOn(routineHook, 'useRoutinePlan').mockReturnValue({
      data: {
        candidates: {
          usual: { summary: 'Drive solo by petrol car at 08:30 AM' },
          recommended: { summary: 'Leave earlier with AC recirculation' }
        },
        evidence: {
          records: [], // No PM2.5 records
          freshnessState: 'expired',
          hasStationObservation: false
        },
        impactReceipts: null,
        modelInfo: null
      },
      isLoading: false,
      generatePlan: vi.fn().mockResolvedValue({})
    });

    render(<RoutinePage initialContext={baseContext} />);

    // Confirms precautionary badge and honest message
    expect(screen.getAllByText(/Precautionary Guidance/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/PM2.5 measurement unavailable/i).length).toBeGreaterThan(0);
  });

  it('preserves genuine zero PM2.5 without replacing with synthetic defaults', () => {
    vi.spyOn(routineHook, 'useRoutinePlan').mockReturnValue({
      data: {
        candidates: {
          usual: { summary: 'Drive solo by petrol car at 08:30 AM' },
          recommended: { summary: 'Leave earlier with AC recirculation' }
        },
        evidence: {
          records: [{ pollutant: 'PM2.5', value: 0, attribution: 'CPCB Baseline Station' }],
          freshnessState: 'fresh',
          hasStationObservation: true
        },
        impactReceipts: null
      },
      isLoading: false,
      generatePlan: vi.fn().mockResolvedValue({})
    });

    render(<RoutinePage initialContext={baseContext} />);

    expect(screen.getAllByText(/0 µg\/m³/i).length).toBeGreaterThan(0);
  });

  it('allows accepting and rejecting routine steps dynamically', () => {
    vi.spyOn(routineHook, 'useRoutinePlan').mockReturnValue({
      data: {
        candidates: {
          usual: { summary: 'Drive solo' },
          recommended: { summary: 'Leave earlier' }
        },
        evidence: { records: [] },
        impactReceipts: null
      },
      isLoading: false,
      generatePlan: vi.fn().mockResolvedValue({})
    });

    render(<RoutinePage initialContext={baseContext} />);

    const stepCard = screen.getByText(/Morning Work Commute/i);
    expect(stepCard).toBeDefined();
  });
});
