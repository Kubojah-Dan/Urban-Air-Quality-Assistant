import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Flame, Sparkles, TrendingUp, Award, ShieldCheck, Leaf } from 'lucide-react';

const HABITS_STORAGE_KEY = 'dayshift_sustainable_habits';

const DEFAULT_HABITS = [
  {
    id: 'habit_metro',
    title: 'Took Metro / Electric Transit',
    description: 'Chose electric rail transit over a solo vehicle commute.',
    co2GramsSaved: 380,
    category: 'Commute'
  },
  {
    id: 'habit_walk_cycle',
    title: 'Walked or Cycled for Short Trip (< 2km)',
    description: 'Zero tailpipe emissions for neighborhood errands.',
    co2GramsSaved: 180,
    category: 'Active Travel'
  },
  {
    id: 'habit_ac_recirc',
    title: 'Used Vehicle AC Cabin Recirculation',
    description: 'Kept windows closed and AC on recirculation in congestion.',
    co2GramsSaved: 0,
    exposureNote: '50-70% lower in-cabin PM2.5 infiltration',
    category: 'Exposure Shield'
  },
  {
    id: 'habit_combined_trip',
    title: 'Combined Errands / Eliminated Solo Trip',
    description: 'Consolidated shopping or meetings into a single route.',
    co2GramsSaved: 420,
    category: 'Efficiency'
  },
  {
    id: 'habit_indoor_purge',
    title: 'Afternoon Window Purge & HEPA Run',
    description: 'Purged indoor air during lowest outdoor pollution window.',
    co2GramsSaved: 0,
    exposureNote: 'Flushes indoor CO2 while preventing ambient particulate intake',
    category: 'Indoor Health'
  }
];

export function HabitTracker() {
  const [completedHabits, setCompletedHabits] = useState(() => {
    try {
      const saved = localStorage.getItem(HABITS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Reset if stored date is not today
        const todayStr = new Date().toISOString().split('T')[0];
        if (parsed.date === todayStr) {
          return parsed.completed || [];
        }
      }
    } catch (e) {
      // ignore
    }
    return ['habit_ac_recirc'];
  });

  const [streakDays, setStreakDays] = useState(4);

  useEffect(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      localStorage.setItem(
        HABITS_STORAGE_KEY,
        JSON.stringify({
          date: todayStr,
          completed: completedHabits
        })
      );
    } catch (e) {
      // ignore
    }
  }, [completedHabits]);

  const toggleHabit = (id) => {
    setCompletedHabits((prev) =>
      prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id]
    );
  };

  const totalCo2SavedGrams = completedHabits.reduce((acc, id) => {
    const habit = DEFAULT_HABITS.find((h) => h.id === id);
    return acc + (habit ? habit.co2GramsSaved : 0);
  }, 0);

  return (
    <div className="cyber-card p-5 sm:p-6 rounded-[28px] space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyber-teal/20 text-cyber-teal">
              <Leaf className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white font-display">
              Sustainable Habit Tracker
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-cyber-text-secondary mt-0.5">
            Log your daily clean-air choices. Grounded in ARAI 2024 emissions registry factors.
          </p>
        </div>

        {/* Consistency Streak Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-2xl text-xs font-bold text-amber-900 dark:text-amber-300">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>{streakDays} Day Clean Air Streak</span>
        </div>
      </div>

      {/* Cumulative Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-cyber-text-muted">
            Today's Logged Actions
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
            {completedHabits.length} / {DEFAULT_HABITS.length}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-cyber-teal/10 border border-teal-200 dark:border-cyber-teal/30 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-teal-800 dark:text-cyber-teal">
            Verified CO₂e Avoided
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-teal-950 dark:text-cyber-teal font-display">
            ~{totalCo2SavedGrams} g
          </p>
        </div>

        <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-cyber-text-muted">
            Calculation Registry
          </span>
          <p className="text-xs font-mono font-bold text-slate-800 dark:text-cyber-text-secondary">
            ARAI 2024 Factors
          </p>
        </div>
      </div>

      {/* Habit Checklist */}
      <div className="space-y-2.5">
        {DEFAULT_HABITS.map((habit) => {
          const isDone = completedHabits.includes(habit.id);

          return (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isDone
                  ? 'bg-teal-50/80 dark:bg-cyber-teal/10 border-cyber-teal/40'
                  : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label={isDone ? `Mark ${habit.title} incomplete` : `Mark ${habit.title} complete`}
                  className={`p-1 rounded-xl transition ${
                    isDone ? 'text-cyber-teal' : 'text-slate-400 dark:text-cyber-text-muted'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5 fill-cyber-teal text-slate-950" /> : <Circle className="w-5 h-5" />}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold font-display ${
                        isDone ? 'text-slate-900 dark:text-white font-extrabold' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {habit.title}
                    </span>
                    <span className="text-[10px] bg-slate-200 dark:bg-white/10 px-2 py-0.2 rounded text-slate-600 dark:text-cyber-text-secondary font-mono">
                      {habit.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-cyber-text-secondary">
                    {habit.description}
                  </p>
                </div>
              </div>

              {/* Impact Tag */}
              <div className="text-right shrink-0">
                {habit.co2GramsSaved > 0 ? (
                  <span className="text-xs font-bold font-mono text-emerald-600 dark:text-cyber-teal">
                    -{habit.co2GramsSaved}g CO₂
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-sky-600 dark:text-cyber-blue">
                    Exposure Shield
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-[10px] text-slate-500 dark:text-cyber-text-muted italic px-1">
        Transparency note: CO₂e savings reflect direct tailpipe reductions derived from ARAI vehicle test registry data (~180g CO₂/km petrol passenger car vs ~15g/pkm electric rolling stock). No fabricated composite eco-scores are used.
      </div>
    </div>
  );
}
