import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ImpactReceipt } from '../src/features/impact/components/ImpactReceipt.jsx';

describe('ImpactReceipt Component & Scientific Integrity', () => {
  it('renders valid PM2.5 observation accurately with unit and monitored telemetry badge', () => {
    const receipt = {
      outdoorContext: {
        windowDescription: 'Morning Work Commute (08:00 - 08:45)',
        pollutant: 'PM2.5',
        value: 78,
        unit: 'µg/m³',
        status: 'measured'
      },
      indoorAction: {
        actionTitle: 'Cabin Recirculation',
        mechanism: 'filtration'
      },
      emissionsEstimate: {
        status: 'estimated',
        estimatedTailpipeCo2GramsSaved: 420,
        basis: 'ARAI 2024 Passenger Vehicle Factor'
      }
    };

    render(<ImpactReceipt receipt={receipt} />);

    expect(screen.getByText(/Channel 1: Outdoor Air Context/i)).toBeDefined();
    expect(screen.getByText(/78 µg\/m³/i)).toBeDefined();
    expect(screen.getByText(/Monitored Ground Telemetry/i)).toBeDefined();
    expect(screen.getByText(/~420g avoided tailpipe CO₂/i)).toBeDefined();
  });

  it('renders forecast distinction transparently for CAMS forecast records', () => {
    const receipt = {
      outdoorContext: {
        windowDescription: 'Forecast Commute Window',
        pollutant: 'PM2.5',
        value: 95,
        unit: 'µg/m³',
        status: 'forecast'
      },
      indoorAction: {
        actionTitle: 'Cabin Recirculation',
        mechanism: 'filtration'
      },
      emissionsEstimate: {
        status: 'not_estimated',
        note: 'Baseline reference.'
      }
    };

    render(<ImpactReceipt receipt={receipt} />);

    expect(screen.getByText(/95 µg\/m³/i)).toBeDefined();
    expect(screen.getByText(/Numerical Forecast/i)).toBeDefined();
  });

  it('renders stale observation notice when data is expired or stale', () => {
    const receipt = {
      outdoorContext: {
        windowDescription: 'Stale Window',
        pollutant: 'PM2.5',
        value: 110,
        unit: 'µg/m³',
        status: 'stale'
      },
      indoorAction: {
        actionTitle: 'Filtration Routine',
        mechanism: 'filtration'
      },
      emissionsEstimate: {
        status: 'not_estimated',
        note: 'Baseline reference.'
      }
    };

    render(<ImpactReceipt receipt={receipt} />);

    expect(screen.getByText(/110 µg\/m³/i)).toBeDefined();
    expect(screen.getByText(/Stale Observation/i)).toBeDefined();
  });

  it('preserves genuine zero PM2.5 reading without fabricating fallbacks', () => {
    const receipt = {
      outdoorContext: {
        windowDescription: 'Clean Air Window',
        pollutant: 'PM2.5',
        value: 0,
        unit: 'µg/m³',
        status: 'measured'
      },
      indoorAction: {
        actionTitle: 'Natural Ventilation',
        mechanism: 'ventilation'
      },
      emissionsEstimate: {
        status: 'not_estimated',
        note: 'Zero baseline difference.'
      }
    };

    render(<ImpactReceipt receipt={receipt} />);

    // Zero must remain explicitly 0 µg/m³ and never be replaced with fallback 42
    expect(screen.getByText(/0 µg\/m³/i)).toBeDefined();
  });

  it('displays explicit unavailable state when PM2.5 measurement is null or missing', () => {
    const receipt = {
      outdoorContext: {
        windowDescription: 'Unmonitored Window',
        pollutant: 'PM2.5',
        value: null,
        unit: 'µg/m³'
      },
      indoorAction: {
        actionTitle: 'Precautionary Source Control',
        mechanism: 'filtration'
      },
      emissionsEstimate: {
        status: 'not_estimated',
        note: 'Missing travel inputs.'
      }
    };

    render(<ImpactReceipt receipt={receipt} />);

    // Must disclose unavailable state honestly
    expect(screen.getByText(/Ambient Pollutant: PM2.5 measurement unavailable/i)).toBeDefined();
    expect(screen.queryByText(/42 µg\/m³/i)).toBeNull();
  });

  it('displays clear note when emissions cannot be estimated without inventing savings', () => {
    const receipt = {
      outdoorContext: {
        windowDescription: 'Scheduled Window',
        pollutant: 'PM2.5',
        value: 65,
        unit: 'µg/m³'
      },
      indoorAction: {
        actionTitle: 'Filtration',
        mechanism: 'filtration'
      },
      emissionsEstimate: {
        status: 'not_estimated',
        note: 'Not estimated: reference travel baseline or verified emissions delta unavailable.'
      }
    };

    render(<ImpactReceipt receipt={receipt} />);

    expect(
      screen.getByText(/Not estimated: reference travel baseline or verified emissions delta unavailable/i)
    ).toBeDefined();
    expect(screen.queryByText(/avoided tailpipe/i)).toBeNull();
  });
});
