import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, ArrowRight, BadgeCheck, Building2, Users, Sparkles } from 'lucide-react';
import { heroImage, heroCollage } from './mockData';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('all');

  const quickFilters = [
    { label: t('landing.quickFilterJobs'), emoji: '💼' },
    { label: t('landing.quickFilterInternships'), emoji: '🎓' },
    { label: t('landing.quickFilterScholarships'), emoji: '🏆' },
    { label: t('landing.quickFilterTraining'), emoji: '📚' },
  ];

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/browse', { state: { search: query, location } });
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-br from-tdop-navy/95 via-tdop-royal/85 to-tdop-royalLight/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.25),transparent_55%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur">
              <BadgeCheck className="w-4 h-4 text-tdop-gold" />
              {t('landing.heroBadge')}
            </span>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              {t('landing.heroTitle')}
            </h1>
            <p className="mt-5 text-lg text-gray-200 leading-relaxed max-w-xl">
              {t('landing.heroSubtitle')}
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-8 bg-white rounded-2xl shadow-navy p-2 flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t('landing.heroSearchPlaceholder')}
                  className="w-full py-2 text-gray-800 outline-none text-sm"
                  aria-label={t('app.search')}
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-t sm:border-t-0 sm:border-l border-gray-200">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <select
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full py-2 text-gray-700 outline-none text-sm bg-transparent"
                  aria-label={t('landing.heroLocationLabel')}
                >
                  <option value="all">{t('landing.heroLocationLabel')}: All</option>
                  <option value="dar-es-salaam">Dar es Salaam</option>
                  <option value="dodoma">Dodoma</option>
                  <option value="arusha">Arusha</option>
                  <option value="mwanza">Mwanza</option>
                  <option value="morogoro">Morogoro</option>
                  <option value="arusha">Zanzibar</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-tdop-accent hover:bg-tdop-goldDark text-tdop-navy font-semibold text-sm transition-colors"
              >
                {t('landing.heroBrowseBtn')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-300">{t('landing.heroQuickFilters')}</span>
              {quickFilters.map(f => (
                <button
                  key={f.label}
                  onClick={() => navigate('/browse')}
                  className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors"
                >
                  {f.emoji} {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4 rotate-0 animate-slide-up">
            <div className="col-span-2 rounded-3xl overflow-hidden shadow-navy ring-4 ring-white/10">
              <img src={heroCollage[0]} alt="Team collaborating" className="w-full h-56 object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-navy ring-2 ring-white/10">
              <img src={heroCollage[1]} alt="Students at work" className="w-full h-40 object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-navy ring-2 ring-white/10">
              <img src={heroCollage[2]} alt="Graduation" className="w-full h-40 object-cover" />
            </div>
            <div className="col-span-2 flex items-center justify-around gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-white text-sm">
                <Building2 className="w-5 h-5 text-tdop-gold" />
                100+ {t('landing.statInstitutions')}
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Users className="w-5 h-5 text-tdop-cyan" />
                50,000+ {t('landing.statUsers')}
              </div>
              <div className="flex items-center gap-2 text-white text-sm">
                <Sparkles className="w-5 h-5 text-tdop-gold" />
                {t('landing.aiMatches')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;