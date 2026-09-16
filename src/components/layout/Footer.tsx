import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const links = {
    quickLinks: [
      { to: '/browse', label: t('footer.linkOpportunities') },
      { to: '/organizations', label: t('nav.organizations') },
      { to: '/dashboard', label: t('footer.linkDashboard') },
      { to: '/saved', label: t('opportunities.savedTitle') },
      { to: '/compare', label: t('opportunities.compareTitle') },
    ],
    resources: [
      { to: '/browse', label: t('dashboard.quickLinkScholarships') },
      { to: '/browse', label: t('dashboard.quickLinkTraining') },
      { to: '/register', label: t('common.careerAdvice') },
      { to: '/profile', label: t('common.resumeTips') },
    ],
    support: [
      { to: '/contact', label: t('common.contactUs') },
      { to: '/help', label: t('footer.linkHelp') },
      { to: '/privacy', label: t('common.privacyPolicy') },
      { to: '/terms', label: t('common.termsOfService') },
    ],
  };

  const socials = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Twitter, label: 'X / Twitter' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Linkedin, label: 'LinkedIn' },
  ];

  return (
    <footer id="help" className="bg-tdop-navy text-gray-300 mt-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Logo dark size="lg" className="mb-4" />
            <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-sm">
              {t('footer.aboutText')}
            </p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-tdop-secondary" />
                {t('footer.headquarters')}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-tdop-secondary" />
                {t('footer.contactEmail')}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-tdop-secondary" />
                {t('footer.contactPhone')}
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              {socials.map(social => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href="#"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-tdop-primary hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {Object.entries(links).map(([key, items]) => (
            <div key={key}>
              <h4 className="font-semibold text-sm uppercase tracking-wider text-white mb-4">
                {t(`footer.${key}`)}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item, i) => (
                  <li key={i}>
                    <Link to={item.to || '#'} className="text-sm text-gray-400 hover:text-tdop-primary transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {t('app.name')} — {t('common.allRightsReserved')}
          </p>
          <p className="text-sm text-gray-500">
            {t('footer.linkAbout')} · Tanzania Digital Opportunity Platform
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
