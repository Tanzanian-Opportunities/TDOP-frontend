import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, Search } from 'lucide-react';

const faqs = [
  { qKey: 'help.faq1Q', aKey: 'help.faq1A' },
  { qKey: 'help.faq2Q', aKey: 'help.faq2A' },
  { qKey: 'help.faq3Q', aKey: 'help.faq3A' },
  { qKey: 'help.faq4Q', aKey: 'help.faq4A' },
  { qKey: 'help.faq5Q', aKey: 'help.faq5A' },
  { qKey: 'help.faq6Q', aKey: 'help.faq6A' },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 text-left">
        <span className="font-medium text-tdop-navy text-sm">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && <p className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{a}</p>}
    </div>
  );
};

const HelpCenterPage: React.FC = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = faqs.filter(faq =>
    t(faq.qKey).toLowerCase().includes(search.toLowerCase()) ||
    t(faq.aKey).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-tdop-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          {t('nav.home', 'Home')}
        </Link>

        <h1 className="font-display text-3xl font-bold text-tdop-navy">{t('footer.linkHelp')}</h1>
        <p className="mt-3 text-gray-500">
          {t('help.description', 'Find answers to common questions about using TDOP.')}
        </p>

        <div className="mt-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('help.searchPlaceholder', 'Search for help...')}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary outline-none bg-white"
          />
        </div>

        <div className="mt-8 space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-8">{t('help.noResults', 'No results found.')}</p>
          ) : (
            filtered.map(faq => (
              <FaqItem key={faq.qKey} q={t(faq.qKey)} a={t(faq.aKey)} />
            ))
          )}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          {t('help.stillNeedHelp', 'Still need help?')}{' '}
          <Link to="/contact" className="text-tdop-primary hover:underline font-medium">{t('common.contactUs')}</Link>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
