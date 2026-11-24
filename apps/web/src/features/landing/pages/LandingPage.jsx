import React from 'react';
import { LandingHero } from '../components/LandingHero.jsx';
import { LandingMobileShowcase } from '../components/LandingMobileShowcase.jsx';
import { LandingLifestyleGallery } from '../components/LandingLifestyleGallery.jsx';
import { LandingStateCoverage } from '../components/LandingStateCoverage.jsx';
import { LandingDecisionProcess } from '../components/LandingDecisionProcess.jsx';

/**
 * LandingPage
 *
 * Screen A & Home Overview page for DayShift.
 * Composed of modular, accessible sections adhering to Clean Architecture:
 * - LandingHero: High-contrast headline, primary CTA triggers, and clean commute showcase.
 * - LandingMobileShowcase: 3-Phone interactive preview of core mobile workflows.
 * - LandingLifestyleGallery: Multi-modal Indian transit & indoor wellness photography.
 * - LandingStateCoverage: All 28 Indian States & Union Territories national footprint.
 * - LandingDecisionProcess: 3-step evidence flow & signature 3-Channel Impact Receipt callout.
 *
 * @param {Object} props
 * @param {() => void} props.onStartOnboarding - Handler for "Build my daily routine" CTA
 * @param {() => void} props.onExploreAirQuality - Handler for "Explore air quality" CTA
 */
export function LandingPage({ onStartOnboarding, onExploreAirQuality }) {
  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. Hero Section */}
      <LandingHero
        onStartOnboarding={onStartOnboarding}
        onExploreAirQuality={onExploreAirQuality}
      />

      {/* 2. Interactive Mobile Showcase */}
      <LandingMobileShowcase />

      {/* 3. Lifestyle & Mobility Gallery */}
      <LandingLifestyleGallery />

      {/* 4. National 28 States & UTs Coverage */}
      <LandingStateCoverage />

      {/* 5. 3-Step Flow & Impact Receipt */}
      <LandingDecisionProcess onStartOnboarding={onStartOnboarding} />
    </div>
  );
}
