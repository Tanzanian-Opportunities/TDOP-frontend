import React from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, BookOpen, PenLine, Send, Activity, Trophy, ChevronRight } from 'lucide-react';

const ProcessSteps: React.FC = () => {
  const { t } = useTranslation();

  const steps = [
    { icon: Compass, num: '01', titleKey: 'processStep1Title', descKey: 'processStep1Desc', color: 'bg-tdop-pastel-jobs text-tdop-royalLight' },
    { icon: BookOpen, num: '02', titleKey: 'processStep2Title', descKey: 'processStep2Desc', color: 'bg-tdop-pastel-internships text-amber-600' },
    { icon: PenLine, num: '03', titleKey: 'processStep3Title', descKey: 'processStep3Desc', color: 'bg-tdop-pastel-scholarships text-green-600' },
    { icon: Send, num: '04', titleKey: 'processStep4Title', descKey: 'processStep4Desc', color: 'bg-tdop-pastel-loans text-purple-600' },
    { icon: Activity, num: '05', titleKey: 'processStep5Title', descKey: 'processStep5Desc', color: 'bg-tdop-pastel-tenders text-cyan-600' },
    { icon: Trophy, num: '06', titleKey: 'processStep6Title', descKey: 'processStep6Desc', color: 'bg-tdop-pastel-events text-tdop-goldDark' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-14">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-tdop-royal">
          {t('landing.processTitle')}
        </h2>
        <p className="mt-3 text-gray-500 max-w-xl mx-auto">{t('landing.processTagline')}</p>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap items-stretch gap-4 lg:gap-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.titleKey}>
              <div className="flex-1 min-w-[170px] text-center rounded-2xl border border-gray-100 bg-tdop-light p-6 hover:shadow-soft hover:-translate-y-1 transition-all duration-200">
                <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${step.color}`}>
                  <Icon className="w-7 h-7" />
                </div>
                <span className="mt-4 block text-xs font-semibold text-gray-400">{step.num}</span>
                <h3 className="mt-1 font-display font-bold text-lg text-tdop-royal">{t(`landing.${step.titleKey}`)}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{t(`landing.${step.descKey}`)}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center text-gray-300 shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};

export default ProcessSteps;