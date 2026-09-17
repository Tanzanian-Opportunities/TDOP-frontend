import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Shield, Target, Users, Globe, Heart, Mail,
  Lightbulb, Building2, BookOpen, Search, FileCheck, BarChart3,
  Linkedin, Twitter, ExternalLink
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    { icon: Shield, titleKey: 'about.value1Title', descKey: 'about.value1Desc', color: 'bg-tdop-secondary/10 text-tdop-secondary' },
    { icon: Target, titleKey: 'about.value2Title', descKey: 'about.value2Desc', color: 'bg-tdop-primary/10 text-tdop-primary' },
    { icon: Users, titleKey: 'about.value3Title', descKey: 'about.value3Desc', color: 'bg-tdop-accent/10 text-tdop-accent' },
    { icon: Globe, titleKey: 'about.value4Title', descKey: 'about.value4Desc', color: 'bg-purple-100 text-purple-600' },
  ];

  const steps = [
    { num: '01', icon: Search, titleKey: 'about.step1Title', descKey: 'about.step1Desc' },
    { num: '02', icon: BookOpen, titleKey: 'about.step2Title', descKey: 'about.step2Desc' },
    { num: '03', icon: FileCheck, titleKey: 'about.step3Title', descKey: 'about.step3Desc' },
    { num: '04', icon: BarChart3, titleKey: 'about.step4Title', descKey: 'about.step4Desc' },
  ];

  const founders = [
    { nameKey: 'about.founder1Name', roleKey: 'about.founder1Role', bioKey: 'about.founder1Bio' },
    { nameKey: 'about.founder2Name', roleKey: 'about.founder2Role', bioKey: 'about.founder2Bio' },
    { nameKey: 'about.founder3Name', roleKey: 'about.founder3Role', bioKey: 'about.founder3Bio' },
  ];

  const team = [
    { nameKey: 'about.team1Name', roleKey: 'about.team1Role' },
    { nameKey: 'about.team2Name', roleKey: 'about.team2Role' },
    { nameKey: 'about.team3Name', roleKey: 'about.team3Role' },
    { nameKey: 'about.team4Name', roleKey: 'about.team4Role' },
  ];

  const stats = [
    { value: '6', labelKey: 'about.stat1Label' },
    { value: '26', labelKey: 'about.stat2Label' },
    { value: '10+', labelKey: 'about.stat3Label' },
    { value: '100%', labelKey: 'about.stat4Label' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-tdop-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-tdop-primary rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-tdop-secondary rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                {t('nav.home', 'Home')}
              </Link>
              <span className="text-xs font-semibold uppercase tracking-widest text-tdop-secondary">
                {t('about.heroBadge')}
              </span>
              <h1 className="mt-3 font-display text-4xl sm:text-5xl font-bold text-white leading-tight">
                {t('about.pageTitle')}
              </h1>
              <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-xl">
                {t('about.pageSubtitle')}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/register" className="inline-flex items-center justify-center bg-tdop-primary text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                  {t('about.ctaRegister')}
                </Link>
                <Link to="/browse" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
                  {t('about.heroBrowse')}
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex justify-center">
              <div className="relative w-80 h-80">
                <div className="absolute inset-0 bg-tdop-primary/20 rounded-3xl rotate-6" />
                <div className="absolute inset-0 bg-tdop-secondary/20 rounded-3xl -rotate-3" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-8 flex flex-col items-center justify-center text-center">
                  <Globe className="w-16 h-16 text-tdop-secondary" />
                  <p className="mt-4 font-display text-2xl font-bold text-white">Tanzania</p>
                  <p className="text-gray-300 text-sm mt-1">{t('about.heroVisualSub')}</p>
                  <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-xl font-bold text-tdop-secondary">26</p>
                      <p className="text-xs text-gray-300">{t('about.heroRegions')}</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-xl font-bold text-tdop-accent">6</p>
                      <p className="text-xs text-gray-300">{t('about.heroCategories')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 space-y-20">

        {/* Mission & Vision */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 lg:p-10">
            <div className="w-12 h-12 rounded-xl bg-tdop-primary/10 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-tdop-primary" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold text-tdop-navy">{t('about.missionTitle')}</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{t('about.missionBody')}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 lg:p-10">
            <div className="w-12 h-12 rounded-xl bg-tdop-secondary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-tdop-secondary" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-bold text-tdop-navy">{t('about.visionTitle')}</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{t('about.visionBody')}</p>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-tdop-primary">
              {t('about.valuesSubtitle')}
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-tdop-navy">{t('about.valuesTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => {
              const Icon = v.icon;
              return (
                <div key={v.titleKey} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-card transition-all duration-200">
                  <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="mt-5 font-semibold text-tdop-navy">{t(v.titleKey)}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{t(v.descKey)}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-tdop-primary">
              {t('about.howSubtitle')}
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-tdop-navy">{t('about.howItWorksTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-tdop-primary/10 flex items-center justify-center relative">
                    <Icon className="w-7 h-7 text-tdop-primary" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-tdop-primary text-white rounded-full text-xs font-bold flex items-center justify-center">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="mt-5 font-semibold text-tdop-navy">{t(step.titleKey)}</h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{t(step.descKey)}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Impact Numbers */}
        <section className="bg-tdop-navy rounded-3xl p-10 lg:p-14">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white">{t('about.impactTitle')}</h2>
            <p className="mt-3 text-gray-300 max-w-2xl mx-auto">{t('about.impactSubtitle')}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.labelKey} className="text-center">
                <p className="font-display text-4xl lg:text-5xl font-extrabold text-tdop-secondary">{stat.value}</p>
                <p className="mt-2 text-sm text-gray-300">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founders */}
        <section>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-tdop-primary">
              {t('about.foundersSubtitle')}
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-tdop-navy">{t('about.foundersTitle')}</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">{t('about.foundersDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {founders.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-8 text-center hover:shadow-card transition-all duration-200">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-tdop-primary to-tdop-secondary flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{t(f.nameKey).split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="mt-5 font-display font-bold text-lg text-tdop-navy">{t(f.nameKey)}</h3>
                <p className="mt-1 text-sm font-medium text-tdop-primary">{t(f.roleKey)}</p>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{t(f.bioKey)}</p>
                <div className="mt-4 flex justify-center gap-3">
                  <a href="#" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-tdop-primary hover:text-white transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-tdop-primary hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-tdop-primary">
              {t('about.teamSubtitle')}
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-tdop-navy">{t('about.teamTitle')}</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">{t('about.teamDesc')}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-card transition-all duration-200">
                <div className="w-16 h-16 mx-auto rounded-full bg-tdop-navy/5 flex items-center justify-center">
                  <span className="text-lg font-bold text-tdop-navy">{t(m.nameKey).split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="mt-4 font-semibold text-sm text-tdop-navy">{t(m.nameKey)}</h3>
                <p className="mt-1 text-xs text-tdop-primary font-medium">{t(m.roleKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Partners / Institutions */}
        <section className="bg-white rounded-2xl border border-gray-100 p-10 lg:p-14">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-tdop-primary">
              {t('about.partnersSubtitle')}
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-tdop-navy">{t('about.partnersTitle')}</h2>
            <p className="mt-3 text-gray-500 max-w-2xl mx-auto">{t('about.partnersDesc')}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="flex items-center justify-center h-20 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-full bg-tdop-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-tdop-primary" />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-gray-400">{t('about.partnersNote')}</p>
        </section>

        {/* Timeline */}
        <section>
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-tdop-primary">
              {t('about.timelineSubtitle')}
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-tdop-navy">{t('about.timelineTitle')}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2" />
            <div className="space-y-12">
              {[
                { yearKey: 'about.milestone1Year', titleKey: 'about.milestone1Title', descKey: 'about.milestone1Desc' },
                { yearKey: 'about.milestone2Year', titleKey: 'about.milestone2Title', descKey: 'about.milestone2Desc' },
                { yearKey: 'about.milestone3Year', titleKey: 'about.milestone3Title', descKey: 'about.milestone3Desc' },
                { yearKey: 'about.milestone4Year', titleKey: 'about.milestone4Title', descKey: 'about.milestone4Desc' },
              ].map((m, i) => (
                <div key={i} className={`relative flex items-start gap-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="hidden lg:block lg:w-1/2" />
                  <div className="absolute left-4 lg:left-1/2 w-3 h-3 bg-tdop-primary rounded-full -translate-x-1/2 mt-1.5 ring-4 ring-white" />
                  <div className="ml-12 lg:ml-0 lg:w-1/2 bg-white rounded-2xl border border-gray-100 p-6">
                    <span className="text-xs font-semibold text-tdop-primary">{t(m.yearKey)}</span>
                    <h3 className="mt-2 font-semibold text-tdop-navy">{t(m.titleKey)}</h3>
                    <p className="mt-2 text-sm text-gray-500 leading-relaxed">{t(m.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-tdop-navy to-blue-800 rounded-3xl p-10 lg:p-14 text-center">
          <Heart className="w-10 h-10 mx-auto text-tdop-accent" />
          <h2 className="mt-6 font-display text-3xl font-bold text-white">{t('about.ctaTitle')}</h2>
          <p className="mt-4 text-gray-300 max-w-lg mx-auto">{t('about.ctaBody')}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="inline-flex items-center justify-center bg-tdop-primary text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              {t('about.ctaRegister')}
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors">
              <Mail className="w-4 h-4" />
              {t('about.ctaContact')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
