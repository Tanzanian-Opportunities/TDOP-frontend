import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ChevronDown, ChevronUp, Search,
  UserPlus, Briefcase, FileText, Building2, Shield,
  Settings, Mail, Phone, MessageCircle, ExternalLink,
  BookOpen, Lightbulb, AlertCircle, CheckCircle, Clock
} from 'lucide-react';

const categories = [
  { id: 'getting-started', icon: UserPlus, color: 'bg-tdop-secondary/10 text-tdop-secondary', titleKey: 'help.catGettingStarted' },
  { id: 'account', icon: Settings, color: 'bg-tdop-primary/10 text-tdop-primary', titleKey: 'help.catAccount' },
  { id: 'opportunities', icon: Briefcase, color: 'bg-tdop-accent/10 text-tdop-accent', titleKey: 'help.catOpportunities' },
  { id: 'applications', icon: FileText, color: 'bg-purple-100 text-purple-600', titleKey: 'help.catApplications' },
  { id: 'organizations', icon: Building2, color: 'bg-pink-100 text-pink-600', titleKey: 'help.catOrganizations' },
  { id: 'trust-safety', icon: Shield, color: 'bg-green-100 text-green-600', titleKey: 'help.catTrustSafety' },
];

const allFaqs = [
  { category: 'getting-started', qKey: 'help.faq1Q', aKey: 'help.faq1A', popular: true },
  { category: 'getting-started', qKey: 'help.faq2Q', aKey: 'help.faq2A', popular: true },
  { category: 'getting-started', qKey: 'help.faq7Q', aKey: 'help.faq7A' },
  { category: 'account', qKey: 'help.faq3Q', aKey: 'help.faq3A' },
  { category: 'account', qKey: 'help.faq8Q', aKey: 'help.faq8A', popular: true },
  { category: 'account', qKey: 'help.faq9Q', aKey: 'help.faq9A' },
  { category: 'opportunities', qKey: 'help.faq4Q', aKey: 'help.faq4A', popular: true },
  { category: 'opportunities', qKey: 'help.faq10Q', aKey: 'help.faq10A' },
  { category: 'opportunities', qKey: 'help.faq11Q', aKey: 'help.faq11A' },
  { category: 'applications', qKey: 'help.faq5Q', aKey: 'help.faq5A', popular: true },
  { category: 'applications', qKey: 'help.faq12Q', aKey: 'help.faq12A' },
  { category: 'applications', qKey: 'help.faq13Q', aKey: 'help.faq13A' },
  { category: 'organizations', qKey: 'help.faq14Q', aKey: 'help.faq14A' },
  { category: 'organizations', qKey: 'help.faq15Q', aKey: 'help.faq15A' },
  { category: 'trust-safety', qKey: 'help.faq6Q', aKey: 'help.faq6A', popular: true },
  { category: 'trust-safety', qKey: 'help.faq16Q', aKey: 'help.faq16A' },
  { category: 'trust-safety', qKey: 'help.faq17Q', aKey: 'help.faq17A' },
];

const FaqItem: React.FC<{ q: string; a: string; isPopular?: boolean }> = ({ q, a, isPopular }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl bg-white transition-all ${open ? 'border-tdop-primary/30 shadow-sm' : 'border-gray-100'}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left gap-4">
        <div className="flex items-center gap-3">
          {isPopular && <span className="shrink-0 text-xs font-semibold bg-tdop-accent/10 text-tdop-accent px-2 py-0.5 rounded-full">Popular</span>}
          <span className="font-medium text-tdop-navy text-sm">{q}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5">
          <div className="pt-2 border-t border-gray-50">
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">{a}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const HelpCenterPage: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = allFaqs.filter(faq => {
    const matchesSearch = !search ||
      t(faq.qKey).toLowerCase().includes(search.toLowerCase()) ||
      t(faq.aKey).toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !activeCategory || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const popularFaqs = allFaqs.filter(f => f.popular);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-tdop-navy py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t('nav.home', 'Home')}
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white">{t('help.pageTitle')}</h1>
          <p className="mt-3 text-gray-300 max-w-xl">{t('help.pageSubtitle')}</p>
          <div className="mt-8 relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('help.searchPlaceholder')}
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-sm focus:ring-2 focus:ring-tdop-primary outline-none bg-white shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Category Cards */}
        {!search && (
          <section>
            <h2 className="font-display text-xl font-bold text-tdop-navy mb-6">{t('help.browseByTopic')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      isActive
                        ? 'border-tdop-primary bg-tdop-primary/5 shadow-sm'
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-10 h-10 mx-auto rounded-xl ${cat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`mt-3 text-xs font-medium ${isActive ? 'text-tdop-primary' : 'text-tdop-navy'}`}>
                      {t(cat.titleKey)}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Popular Articles */}
        {!search && !activeCategory && (
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="w-5 h-5 text-tdop-accent" />
              <h2 className="font-display text-xl font-bold text-tdop-navy">{t('help.popularArticles')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularFaqs.map(faq => (
                <div key={faq.qKey} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-all">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-tdop-secondary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-tdop-navy">{t(faq.qKey)}</p>
                      <p className="mt-2 text-xs text-gray-500 leading-relaxed line-clamp-2">{t(faq.aKey)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-tdop-navy">
              {activeCategory
                ? t(categories.find(c => c.id === activeCategory)?.titleKey || '')
                : search
                  ? t('help.searchResults')
                  : t('help.allQuestions')
              }
            </h2>
            <span className="text-sm text-gray-400">{filtered.length} {t('help.questions')}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <AlertCircle className="w-12 h-12 mx-auto text-gray-300" />
              <p className="mt-4 text-gray-500">{t('help.noResults')}</p>
              <p className="mt-1 text-sm text-gray-400">{t('help.noResultsDesc')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(faq => (
                <FaqItem
                  key={faq.qKey}
                  q={t(faq.qKey)}
                  a={t(faq.aKey)}
                  isPopular={faq.popular}
                />
              ))}
            </div>
          )}
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="mt-4 text-sm text-tdop-primary hover:underline"
            >
              {t('help.clearFilter')}
            </button>
          )}
        </section>

        {/* Quick Links */}
        <section className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="font-display text-xl font-bold text-tdop-navy mb-6">{t('help.quickLinksTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/browse" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-tdop-primary/5 transition-colors">
              <Briefcase className="w-5 h-5 text-tdop-primary" />
              <div>
                <p className="text-sm font-medium text-tdop-navy">{t('help.linkBrowse')}</p>
                <p className="text-xs text-gray-500">{t('help.linkBrowseDesc')}</p>
              </div>
            </Link>
            <Link to="/register" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-tdop-primary/5 transition-colors">
              <UserPlus className="w-5 h-5 text-tdop-primary" />
              <div>
                <p className="text-sm font-medium text-tdop-navy">{t('help.linkRegister')}</p>
                <p className="text-xs text-gray-500">{t('help.linkRegisterDesc')}</p>
              </div>
            </Link>
            <Link to="/privacy" className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-tdop-primary/5 transition-colors">
              <Shield className="w-5 h-5 text-tdop-primary" />
              <div>
                <p className="text-sm font-medium text-tdop-navy">{t('help.linkPrivacy')}</p>
                <p className="text-xs text-gray-500">{t('help.linkPrivacyDesc')}</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="bg-gradient-to-r from-tdop-navy to-blue-800 rounded-2xl p-8 lg:p-10">
          <div className="text-center">
            <MessageCircle className="w-10 h-10 mx-auto text-tdop-secondary" />
            <h2 className="mt-4 font-display text-2xl font-bold text-white">{t('help.stillNeedHelp')}</h2>
            <p className="mt-3 text-gray-300 max-w-lg mx-auto">{t('help.contactDesc')}</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <a href="mailto:info@tdop.go.tz" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 text-white text-sm font-medium transition-colors">
                <Mail className="w-4 h-4" />
                {t('help.contactEmail')}
              </a>
              <a href="tel:+255222197000" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 text-white text-sm font-medium transition-colors">
                <Phone className="w-4 h-4" />
                {t('help.contactPhone')}
              </a>
              <Link to="/contact" className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 text-white text-sm font-medium transition-colors">
                <ExternalLink className="w-4 h-4" />
                {t('help.contactForm')}
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              {t('help.responseTime')}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenterPage;
