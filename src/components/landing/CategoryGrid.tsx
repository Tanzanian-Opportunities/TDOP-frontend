import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Briefcase, GraduationCap, Award, Coins, ClipboardList, Calendar, BookOpen, ArrowRight
} from 'lucide-react';

const CategoryGrid: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    { key: 'catJobs', icon: Briefcase, pastel: 'bg-tdop-pastel-jobs', text: 'text-tdop-royalLight', count: 1240 },
    { key: 'catInternships', icon: GraduationCap, pastel: 'bg-tdop-pastel-internships', text: 'text-amber-600', count: 860 },
    { key: 'catScholarships', icon: Award, pastel: 'bg-tdop-pastel-scholarships', text: 'text-green-600', count: 540 },
    { key: 'catLoans', icon: Coins, pastel: 'bg-tdop-pastel-loans', text: 'text-purple-600', count: 320 },
    { key: 'catTenders', icon: ClipboardList, pastel: 'bg-tdop-pastel-tenders', text: 'text-cyan-600', count: 410 },
    { key: 'catEvents', icon: Calendar, pastel: 'bg-tdop-pastel-events', text: 'text-tdop-goldDark', count: 280 },
    { key: 'catTraining', icon: BookOpen, pastel: 'bg-tdop-pastel-training', text: 'text-rose-600', count: 610 },
  ];

  return (
    <section className="bg-white py-20" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-tdop-cyan">
              {t('landing.categoriesSubtitle')}
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-tdop-royal">
              {t('landing.categoriesTitle')}
            </h2>
          </div>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-tdop-primary font-medium hover:gap-3 transition-all text-sm"
          >
            {t('opportunities.browseTitle')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.key}
                to="/browse"
                className="group rounded-2xl border border-gray-100 hover:border-tdop-primary/30 hover:shadow-soft p-6 transition-all duration-200"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${cat.pastel} ${cat.text} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-tdop-royal">{t(`landing.${cat.key}`)}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('landing.catCounts', { count: cat.count.toLocaleString() })}</p>
              </Link>
            );
          })}

          <Link
            to="/browse"
            className="group rounded-2xl bg-gradient-to-br from-tdop-royal to-tdop-royalLight hover:from-tdop-royalLight hover:to-tdop-cyan p-6 text-white transition-all duration-200 flex flex-col justify-center"
          >
            <ArrowRight className="w-8 h-8 mb-2 text-tdop-gold group-hover:translate-x-1 transition-transform" />
            <h3 className="font-display font-semibold">{t('landing.heroBrowseBtn')}</h3>
            <p className="mt-1 text-sm text-white/70">{t('landing.featuredSubtitle')}</p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;