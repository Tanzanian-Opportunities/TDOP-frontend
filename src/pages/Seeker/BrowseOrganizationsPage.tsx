import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
 Building2,
 MapPin,
 Calendar,
 Users,
 ShieldCheck,
 Briefcase,
 Search,
 ArrowRight,
 AlertCircle,
} from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Organization {
 id: string;
 name: string;
 location: string;
 sector: string;
 foundedYear: number;
 employeeCount: string;
 verified: boolean;
 openRoles: number;
 description: string;
}

// Fictional demo organizations registered on TDOP — matches the browse feed seed.
const DEMO_ORGANIZATIONS: Organization[] = [
 {
 id: 'org-techcorp',
 name: 'TechCorp Tanzania',
 location: 'Dar es Salaam',
 sector: 'Information Technology',
 foundedYear: 2012,
 employeeCount: '250-500',
 verified: true,
 openRoles: 14,
 description:
 'A growing software house building digital products for banking, agriculture and logistics across East Africa.',
 },
 {
 id: 'org-serengeti',
 name: 'Serengeti Agritech',
 location: 'Arusha',
 sector: 'Agriculture',
 foundedYear: 2016,
 employeeCount: '100-250',
 verified: true,
 openRoles: 9,
 description:
 'Smart-farming solutions connecting smallholder farmers with input suppliers, markets and weather data.',
 },
 {
 id: 'org-datalab',
 name: 'Tanzania Data Lab',
 location: 'Dar es Salaam',
 sector: 'Data & AI',
 foundedYear: 2019,
 employeeCount: '50-100',
 verified: true,
 openRoles: 6,
 description:
 'Open-data and machine-learning lab running analytics fellowships for government and the private sector.',
 },
 {
 id: 'org-udsm',
 name: 'UDSM - Lifelong Learning',
 location: 'Dar es Salaam',
 sector: 'Education',
 foundedYear: 1970,
 employeeCount: '1,000+',
 verified: true,
 openRoles: 21,
 description:
 'Continuing-education centre of the University of Dar es Salaam offering evening classes, short courses and professional certificates.',
 },
 {
 id: 'org-unesco',
 name: 'UNESCO Tanzania',
 location: 'Dar es Salaam',
 sector: 'International Organization',
 foundedYear: 1962,
 employeeCount: '25-50',
 verified: true,
 openRoles: 4,
 description:
 'UNESCO country office promoting education, science, culture and communication programmes across Tanzania.',
 },
 {
 id: 'org-mict',
 name: 'Ministry of ICT Tanzania',
 location: 'Dodoma',
 sector: 'Government',
 foundedYear: 2017,
 employeeCount: '500+',
 verified: true,
 openRoles: 12,
 description:
 'Lead ministry for digital transformation, ICT policy, e-government services and national digital skills.',
 },
 {
 id: 'org-nimr',
 name: 'NIMR Tanzania',
 location: 'Dar es Salaam',
 sector: 'Health & Research',
 foundedYear: 1980,
 employeeCount: '250-500',
 verified: true,
 openRoles: 7,
 description:
 'National Institute for Medical Research running internships and field research placements for young scientists.',
 },
 {
 id: 'org-design',
 name: 'Design Studio Tanzania',
 location: 'Dar es Salaam',
 sector: 'Creative & Design',
 foundedYear: 2015,
 employeeCount: '10-50',
 verified: false,
 openRoles: 3,
 description:
 'Independent design collective offering UI/UX apprenticeships and portfolio-building projects for junior creatives.',
 },
];

const SECTORS = Array.from(new Set(DEMO_ORGANIZATIONS.map((o) => o.sector))).sort();

const BrowseOrganizationsPage: React.FC = () => {
 const { t } = useTranslation();
 const [searchInput, setSearchInput] = useState('');
 const [sector, setSector] = useState('all');

 const filtered = useMemo(() => {
 const q = searchInput.trim().toLowerCase();
 return DEMO_ORGANIZATIONS.filter((o) => {
 const matchesSector = sector === 'all' || o.sector === sector;
 const matchesQuery =
 !q ||
 o.name.toLowerCase().includes(q) ||
 o.location.toLowerCase().includes(q) ||
 o.sector.toLowerCase().includes(q) ||
 o.description.toLowerCase().includes(q);
 return matchesSector && matchesQuery;
 });
 }, [searchInput, sector]);

 return (
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
 <div className="rounded-3xl bg-tdop-primary p-8 sm:p-10 text-white shadow-soft overflow-hidden relative">
 <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
 <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-tdop-accent/10 blur-3xl" />
 <div className="relative space-y-2">
 <div className="inline-flex items-center gap-2 text-white/80 text-sm">
 <Building2 className="w-4 h-4 text-tdop-accent" />
 {t('organizations.browse')}
 </div>
 <h1 className="font-display font-extrabold text-3xl sm:text-4xl">
 {t('organizations.heading')}
 </h1>
 <p className="text-white/80 max-w-2xl text-sm sm:text-base">{t('organizations.subtitle')}</p>
 </div>
 </div>

 <div className="pt-1">
 <SearchBar
 value={searchInput}
 onChange={setSearchInput}
 placeholder={t('nav.searchOrganizations')}
 />
 </div>

 <div className="flex flex-wrap gap-2">
 <button
 onClick={() => setSector('all')}
 className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
 sector === 'all'
 ? 'bg-tdop-primary text-white border-tdop-primary'
 : 'border-gray-200 text-gray-600 hover:border-tdop-primary'
 }`}
 >
 {t('organizations.all')}
 </button>
 {SECTORS.map((s) => (
 <button
 key={s}
 onClick={() => setSector(s)}
 className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
 sector === s
 ? 'bg-tdop-primary text-white border-tdop-primary'
 : 'border-gray-200 text-gray-600 hover:border-tdop-primary'
 }`}
 >
 {s}
 </button>
 ))}
 </div>

 <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
 {filtered.map((org) => (
 <Link
 key={org.id}
 to={`/browse?organization=${encodeURIComponent(org.name)}`}
 className="group bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-card hover:border-tdop-primary/30 transition-all p-6 flex flex-col"
 >
 <div className="flex items-start justify-between gap-3">
 <div className="flex items-center gap-3 min-w-0">
 <div className="w-12 h-12 rounded-xl bg-tdop-primary flex items-center justify-center text-white font-bold shrink-0">
 {org.name.charAt(0)}
 </div>
 <div className="min-w-0">
 <h2 className="font-semibold text-tdop-navy group-hover:text-tdop-primary transition-colors truncate">
 {org.name}
 </h2>
 <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
 <MapPin className="w-3 h-3" />
 <span className="truncate">{org.location}</span>
 </p>
 </div>
 </div>
 {org.verified ? (
 <Badge
 className="flex items-center gap-1 bg-green-100 text-green-800"
 size="sm"
 >
 <ShieldCheck className="w-3 h-3" />
 {t('organizations.verified')}
 </Badge>
 ) : (
 <Badge
 className="flex items-center gap-1 bg-amber-100 text-amber-800"
 size="sm"
 >
 {t('organizations.pending')}
 </Badge>
 )}
 </div>

 <p className="mt-4 text-sm text-gray-600 line-clamp-3 flex-1">
 {org.description}
 </p>

 <div className="mt-5 grid grid-cols-3 gap-2 text-xs text-gray-500">
 <div className="flex flex-col items-center py-2 rounded-xl bg-tdop-light">
 <Calendar className="w-4 h-4 text-tdop-primary mb-1" />
 <span className="flex items-center gap-1 whitespace-nowrap">
 <Building2 className="w-3 h-3" />
 {org.foundedYear}
 </span>
 </div>
 <div className="flex flex-col items-center py-2 rounded-xl bg-tdop-light">
 <Users className="w-4 h-4 text-tdop-primary mb-1" />
 {org.employeeCount}
 </div>
 <div className="flex flex-col items-center py-2 rounded-xl bg-tdop-light">
 <Briefcase className="w-4 h-4 text-tdop-primary mb-1" />
 {t('organizations.viewOpportunities', { count: org.openRoles })}
 </div>
 </div>

 <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-100">
 <span className="text-xs text-gray-400 truncate max-w-[60%]">
 {org.sector}
 </span>
 <span className="inline-flex items-center gap-1 text-sm font-medium text-tdop-primary">
 {t('organizations.viewOpportunities')}
 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
 </span>
 </div>
 </Link>
 ))}
 </div>

 {filtered.length === 0 && (
 <Card className="py-12 text-center">
 <AlertCircle className="w-10 h-10 mx-auto text-gray-300" />
 <h2 className="mt-4 font-display font-bold text-lg text-tdop-navy">
 {t('organizations.noResults')}
 </h2>
 <p className="text-sm text-gray-500">{t('organizations.noResultsDesc')}</p>
 <button
 onClick={() => {
 setSearchInput('');
 setSector('all');
 }}
 className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tdop-primary text-white text-sm font-medium hover:bg-tdop-primaryDark transition-colors"
 >
 <Search className="w-4 h-4" />
 {t('organizations.clearSearch')}
 </button>
 </Card>
 )}
 </div>
 );
};

export default BrowseOrganizationsPage;
