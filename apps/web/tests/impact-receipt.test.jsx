import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ImpactReceipt } from '../src/features/impact/components/ImpactReceipt.jsx';

describe('ImpactReceipt Component & Scientific Integrity', () => {
  it('renders valid PM2.5 observation accurately with unit', () => {
    const receipt = {
      outdoorContext: {
        windowDescription: 'Morning Work Commute (08:00 - 08:45)',
        pollutant: 'PM2.5',
        value: 78,
        unit: 'µg/m³'
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
    expect(screen.getByText(/Ambient Pollutant: PM2.5 \(78 µg\/m³\)/i)).toBeDefined();
    expect(screen.getByText(/~420g avoided tailpipe CO₂/i)).toBeDefined();
  });

  it('preserves genuine zero PM2.5 reading without fabricating fallbacks', () => {
    const receipt = {
      outdoorContext: {
        windowDescription: 'Clean Air Window',
        pollutant: 'PM2.5',
        value: 0,
        unit: 'µg/m³'
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
    expect(screen.getByText(/Ambient Pollutant: PM2.5 \(0 µg\/m³\)/i)).toBeDefined();
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
        note: 'Required baseline travel inputs unavailable.'
      }
    };

    render(<ImpactReceipt receipt={receipt} />);

    expect(screen.getByText(/Ambient Pollutant: PM2.5 measurement unavailable/i)).toBeDefined();
    expect(screen.queryByText(/42 µg\/m³/i)).toBeNull();
  });

  it('displays explicit unavailable state when PM2.5 measurement is non-numeric or undefined', () => {
    const receipt = {
      outdoorContext: {
        windowDescription: 'Unknown Sensor Data',
        pollutant: 'PM2.5',
        value: undefined,
        unit: 'µg/m³'
      },
      indoorAction: {
        actionTitle: 'Precautionary Filtration',
        mechanism: 'filtration'
      },
      emissionsEstimate: {
        status: 'not_estimated',
        note: 'Not estimated: reference travel baseline.'
      }
    };

    render(<ImpactReceipt receipt={receipt} />);

    expect(screen.getByText(/Ambient Pollutant: PM2.5 measurement unavailable/i)).toBeDefined();
  });

  it('renders unestimated emissions state with note when travel inputs are missing', () => {
    const receipt = {
      outdoorContext: {
        windowDescription: 'Baseline Commute',
        pollutant: 'PM2.5',
        value: 55,
        unit: 'µg/m³'
      },
      indoorAction: {
        actionTitle: 'Standard Routine',
        mechanism: 'source_control'
      },
      emissionsEstimate: {
        status: 'not_estimated',
        estimatedTailpipeCo2GramsSaved: null,
        note: 'Not estimated: reference travel baseline.'
      }
    };

    render(<ImpactReceipt receipt={receipt} />);

    expect(screen.getByText(/Not estimated: reference travel baseline./i)).toBeDefined();
    expect(screen.queryByText(/~380g avoided tailpipe CO₂/i)).toBeNull();
  });
});
