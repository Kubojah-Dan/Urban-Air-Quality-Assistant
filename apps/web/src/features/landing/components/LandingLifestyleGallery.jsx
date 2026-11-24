import React from 'react';
import { ArrowRight } from 'lucide-react';

/**
 * LandingLifestyleGallery Component
 *
 * Visual lifestyle and mobility grid showcasing clean urban transport,
 * indoor apartment wellness, smart wearables, and electric vehicle adoption.
 */
export function LandingLifestyleGallery() {
  const cards = [
    {
      img: '/assets/indian-clean-commute.jpg',
      alt: 'Clean Indian Commute',
      badge: 'Metro & EV Bus',
      badgeClass: 'text-cyber-teal border-cyber-teal/30',
      title: 'Multi-Modal Indian Commute',
      description: 'Real transit integration across Delhi Metro, Bengaluru Namma Metro, Mumbai Line 2A/7, and electric feeder buses.',
      cta: 'Avoid curb-level diesel fumes',
      ctaColor: 'text-cyber-teal'
    },
    {
      img: '/assets/indian-smart-transit-metro.jpg',
      alt: 'Indian Commuter Checking Air Quality on Smartwatch at Metro Station',
      badge: 'Smart Wearables',
      badgeClass: 'text-cyber-blue border-cyber-blue/30',
      title: 'Contextual Smartwatch Guidance',
      description: 'Glanceable air intelligence on arrival times, optimal transfer stations, and shaded walking paths.',
      cta: 'Instant atmospheric cues',
      ctaColor: 'text-cyber-blue'
    },
    {
      img: '/assets/indian-air-purifier-tech.jpg',
      alt: 'Cylindrical Smart Air Purifier with Glowing LED in Modern Indian Apartment',
      badge: 'Purification Tech',
      badgeClass: 'text-cyber-teal border-cyber-teal/30',
      title: 'Sleek Smart Air Technology',
      description: 'Real-time CADR-rated clean air delivery, digital filter life tracking, and quiet nocturnal fan modes.',
      cta: 'Optimized filter longevity',
      ctaColor: 'text-cyber-teal'
    },
    {
      img: '/assets/indian-indoor-wellness.jpg',
      alt: 'Sunlit Indian Living Room with Areca Palm and Clean Air Coach',
      badge: 'Indoor Coach',
      badgeClass: 'text-cyber-purple border-cyber-purple/30',
      title: 'Household Air & Cooking Safety',
      description: 'Clear protocols on tadka frying ventilation, agarbatti/dhoop smoke management, and cross-breeze timing.',
      cta: 'No-purchase source control',
      ctaColor: 'text-cyber-purple'
    },
    {
      img: '/assets/indian-morning-routine.jpg',
      alt: 'Active Morning Walk in Green Urban Park',
      badge: 'Outdoor Fitness',
      badgeClass: 'text-cyber-amber border-cyber-amber/30',
      title: 'Beat the Winter Inversion Layer',
      description: 'Pinpoint safe hours for running, cycling, and walking when daytime solar heating lifts trapped smog.',
      cta: 'CAMS atmospheric forecast',
      ctaColor: 'text-cyber-amber'
    },
    {
      img: '/assets/ev-car.jpg',
      alt: 'Electric Vehicle Sustainable Charging Companion',
      badge: 'EV Mobility',
      badgeClass: 'text-cyber-teal border-cyber-teal/30',
      title: 'Zero Tailpipe EV Charging',
      description: 'Shift to electric 2-wheelers and 4-wheelers with transparent lifecycle grid factor disclosures.',
      cta: 'Zero curb emissions',
      ctaColor: 'text-cyber-teal'
    }
  ];

  return (
    <section className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyber-teal font-display">
          Aesthetic Visuals
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Designed for Modern Indian Cities
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-cyber-text-secondary">
          From smart metro transit to indoor apartment wellness, DayShift integrates seamlessly into everyday routines.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="cyber-card rounded-[28px] overflow-hidden flex flex-col justify-between hover:border-cyber-teal/40 transition-all group"
          >
            <div className="aspect-[16/10] overflow-hidden relative">
              <img
                src={card.img}
                alt={card.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span
                className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-black/70 px-2.5 py-1 rounded-full border ${card.badgeClass}`}
              >
                {card.badge}
              </span>
            </div>
            <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-display">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-1 leading-relaxed">
                  {card.description}
                </p>
              </div>
              <div className={`pt-2 text-xs font-bold ${card.ctaColor} flex items-center gap-1`}>
                <span>{card.cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
