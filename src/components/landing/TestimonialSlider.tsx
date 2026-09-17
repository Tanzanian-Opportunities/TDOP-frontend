import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Quote, ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react';

interface Story {
  name: string;
  role: string;
  quote: string;
  outcome: string;
  emoji: string;
  gradient: string;
  soft: string;
  statValue: string;
  statLabel: string;
}

const AUTOPLAY_MS = 7000;

const TestimonialSlider: React.FC = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const storyNames = [
    t('landing.testimonial1Name'),
    t('landing.testimonial2Name'),
    t('landing.testimonial3Name'),
  ];

  const baseStories = storyNames
    .filter(name => name && !name.startsWith('landing.'))
    .map((name, i) => ({
      name,
      role: t(`landing.testimonial${i + 1}Role`),
      quote: t(`landing.testimonial${i + 1}Quote`),
    }));

  const storyMeta = [
    {
      outcome: t('landing.storyOutcome1'),
      emoji: '💼',
      gradient: 'from-blue-500 to-indigo-600',
      soft: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300',
      statValue: t('landing.storyStat1Value'),
      statLabel: t('landing.storyStat1Label'),
    },
    {
      outcome: t('landing.storyOutcome2'),
      emoji: '🎓',
      gradient: 'from-emerald-500 to-teal-600',
      soft: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
      statValue: t('landing.storyStat2Value'),
      statLabel: t('landing.storyStat2Label'),
    },
    {
      outcome: t('landing.storyOutcome3'),
      emoji: '🌱',
      gradient: 'from-amber-500 to-orange-600',
      soft: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
      statValue: t('landing.storyStat3Value'),
      statLabel: t('landing.storyStat3Label'),
    },
  ];

  const stories: Story[] = baseStories.map((s, i) => ({ ...s, ...storyMeta[i] }));

  if (stories.length === 0) return null;

  const total = stories.length;
  const item = stories[index];

  useEffect(() => {
    if (total <= 1 || paused) return;
    const id = setInterval(() => {
      setDirection('next');
      setIndex(prev => (prev + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [total, paused]);

  const go = (dir: 'next' | 'prev') => {
    setDirection(dir);
    if (dir === 'next') setIndex(prev => (prev + 1) % total);
    else setIndex(prev => (prev - 1 + total) % total);
  };

  const jump = (i: number) => {
    if (i === index) return;
    setDirection(i > index ? 'next' : 'prev');
    setIndex(i);
  };

  const entryAnimation = direction === 'next' ? 'animate-story-left' : 'animate-story-right';

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) > 50) go(delta < 0 ? 'next' : 'prev');
  };

  return (
    <section
      className="relative overflow-hidden bg-gray-50 py-20 dark:bg-gray-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -top-28 -left-28 h-96 w-96 rounded-full bg-tdop-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-28 h-[30rem] w-[30rem] rounded-full bg-tdop-secondary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-tdop-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-tdop-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {t('landing.testimonialsSubtitle')}
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold text-tdop-navy sm:text-4xl">
              {t('landing.testimonialsTitle')}
            </h2>
            <p className="mt-2 text-gray-500">{t('landing.storiesSub')}</p>
          </div>

          {total > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => go('prev')}
                aria-label="Previous story"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-tdop-primary shadow-soft transition-all hover:bg-tdop-primary hover:text-white hover:shadow-gold dark:border-gray-700 dark:bg-gray-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go('next')}
                aria-label="Next story"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-tdop-primary shadow-soft transition-all hover:bg-tdop-primary hover:text-white hover:shadow-gold dark:border-gray-700 dark:bg-gray-800"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div
            className="relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-tdop-primary via-tdop-secondary to-tdop-accent" />
            <Quote className="absolute -right-6 -top-8 h-48 w-48 rotate-12 text-tdop-primary/5" />

            <div key={`${index}-${direction}`} className={`p-8 sm:p-12 ${entryAnimation}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${item.soft}`}>
                  <span className="text-sm">{item.emoji}</span>
                  {item.outcome}
                </span>
              </div>

              <blockquote className="mt-6 text-xl font-medium leading-snug text-tdop-navy sm:text-2xl">
                <span className="text-tdop-accent">“</span>
                {item.quote}
                <span className="text-tdop-accent">”</span>
              </blockquote>

              <div className="mt-8 flex items-center gap-4">
                <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-3xl shadow-soft`}>
                  {item.emoji}
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-tdop-navy">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-6 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <span className="font-display text-2xl font-extrabold text-tdop-primary">{item.statValue}</span>
                  <span className="max-w-[11rem] text-xs leading-tight text-gray-500">{item.statLabel}</span>
                </div>
                <a
                  href="#/browse"
                  onClick={e => e.preventDefault()}
                  className="inline-flex items-center gap-2 rounded-full bg-tdop-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:gap-3 hover:bg-blue-700"
                >
                  {t('landing.readStory')}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-[2rem] border border-gray-100 bg-white/80 p-5 backdrop-blur dark:border-gray-700 dark:bg-gray-800/80 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                {t('landing.storiesLabel')}
              </span>
              <span className="font-display text-xs font-bold text-tdop-primary">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {stories.map((s, i) => {
                const active = i === index;
                return (
                  <button
                    key={i}
                    onClick={() => jump(i)}
                    aria-label={`Go to story by ${s.name}`}
                    className={`group w-full rounded-2xl border p-3.5 text-left transition-all duration-300 ${
                      active
                        ? 'border-tdop-primary/30 bg-gradient-to-br from-tdop-primary/5 to-tdop-secondary/5 shadow-soft'
                        : 'border-gray-100 hover:border-tdop-primary/20 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-xl`}>
                        {s.emoji}
                        {active && (
                          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-white bg-tdop-accent dark:border-gray-800" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-sm font-semibold ${active ? 'text-tdop-primary' : 'text-tdop-navy'}`}>
                          {s.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">{s.role}</p>
                      </div>
                      {active && <ChevronRight className="h-4 w-4 shrink-0 text-tdop-primary" />}
                    </div>

                    <div className="mt-3 h-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                      <div
                        key={active ? index : `inactive-${i}`}
                        className={`h-full rounded-full bg-gradient-to-r from-tdop-primary via-tdop-secondary to-tdop-accent ${
                          active ? 'animate-progress-fill' : ''
                        }`}
                        style={active && paused ? { animationPlayState: 'paused' } : undefined}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-5">
              <a
                href="#/browse"
                onClick={e => e.preventDefault()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-tdop-primary transition-colors hover:text-blue-700"
              >
                {t('landing.ctaTitle')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {total > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => jump(i)}
                aria-label={`Go to story ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-gradient-to-r from-tdop-primary to-tdop-secondary' : 'w-2.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSlider;