import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRight, BadgeCheck, CheckCircle2 } from 'lucide-react';
import RegionSelect, { RegionOption } from './RegionSelect';

const heroImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('all');

  const regionOptions: RegionOption[] = [
    { value: 'all', label: t('landing.heroLocationAll') },
    { value: 'dar-es-salaam', label: 'Dar es Salaam' },
    { value: 'dodoma', label: 'Dodoma' },
    { value: 'arusha', label: 'Arusha' },
    { value: 'kilimanjaro', label: 'Kilimanjaro' },
    { value: 'mwanza', label: 'Mwanza' },
    { value: 'morogoro', label: 'Morogoro' },
    { value: 'tanga', label: 'Tanga' },
    { value: 'mbeya', label: 'Mbeya' },
    { value: 'zanzibar', label: 'Zanzibar' },
  ];

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
    <section className="relative overflow-hidden bg-white">
      <div className="absolute inset-0">
        <img src={heroImage} alt="" className="w-full h-full object-cover opacity-[0.07]" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-br from-tdop-primary/5 via-transparent to-tdop-secondary/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-tdop-primary/10 text-tdop-primary text-sm font-semibold">
              <BadgeCheck className="w-4 h-4" />
              {t('landing.heroBadge')}
            </span>

            <h1 className="mt-6 font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-tdop-navy leading-[1.1] tracking-tight">
              {t('landing.heroTitle')}
            </h1>
            <p className="mt-5 text-lg text-gray-600 leading-relaxed max-w-xl">
              {t('landing.heroSubtitle')}
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-8 bg-white rounded-2xl shadow-elevated border border-gray-100 p-2 flex flex-col sm:flex-row gap-2"
            >
              <div className="flex-1 flex items-center gap-2 px-3">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t('landing.heroSearchPlaceholder')}
                  className="w-full py-2.5 text-gray-800 outline-none text-sm"
                  aria-label={t('app.search')}
                />
              </div>
              <div className="flex items-center border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700">
                <RegionSelect
                  value={location}
                  onChange={setLocation}
                  options={regionOptions}
                  placeholder={t('landing.heroLocationLabel')}
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-tdop-primary hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-soft"
              >
                {t('landing.heroBrowseBtn')}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              {quickFilters.map(f => (
                <button
                  key={f.label}
                  onClick={() => navigate('/browse')}
                  className="px-3.5 py-1.5 rounded-full bg-gray-50 text-gray-700 text-sm font-medium hover:bg-tdop-primary/5 hover:text-tdop-primary transition-all duration-200 border border-gray-100"
                >
                  {f.emoji} {f.label}
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              {[
                { icon: CheckCircle2, text: t('landing.heroTrust1') || 'Verified listings' },
                { icon: CheckCircle2, text: t('landing.heroTrust2') || 'Trusted organizations' },
                { icon: CheckCircle2, text: t('landing.heroTrust3') || 'Free to use' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <item.icon className="w-4 h-4 text-tdop-secondary" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-tdop-primary/5 rounded-3xl blur-2xl" />
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-elevated border border-white/30 p-8 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-tdop-primary/10 flex items-center justify-center">
                    <Search className="w-5 h-5 text-tdop-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-tdop-navy text-sm">Discover Opportunities</p>
                    <p className="text-xs text-gray-500">Browse verified listings across Tanzania</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Jobs & Employment', 'Internships & Training', 'Scholarships & Grants', 'Government Tenders'].map((item, i) => (
                    <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-tdop-primary/5 transition-colors cursor-pointer" onClick={() => navigate('/browse')}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-tdop-primary/10 text-tdop-primary' : i === 1 ? 'bg-amber-100 text-amber-700' : i === 2 ? 'bg-emerald-100 text-emerald-700' : 'bg-teal-100 text-teal-700'}`}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </div>
                  ))}
                </div>
                <div className="pt-2 text-center">
                  <button onClick={() => navigate('/browse')} className="text-sm font-semibold text-tdop-primary hover:text-blue-700 transition-colors">
                    Browse all opportunities →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
