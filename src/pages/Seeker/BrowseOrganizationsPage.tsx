import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2, MapPin, Calendar, Users, ShieldCheck, Briefcase,
  Search, ArrowRight, AlertCircle,
} from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { organizationApi } from '@/services/api/organizationApi';

interface Organization {
  id: string;
  orgName: string;
  description?: string;
  industry?: string;
  size?: string;
  logo?: string;
  verified: boolean;
  website?: string;
  createdAt: string;
}

const BrowseOrganizationsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchInput, setSearchInput] = useState('');
  const [sector, setSector] = useState('all');
const [organizations, setOrganizations] = useState<Organization[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

useEffect(() => {
  fetchOrganizations();
}, []);

const fetchOrganizations = async () => {
  try {
    const data = await organizationApi.getOrganizations();
    setOrganizations(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error(err);
    setError(true);
  } finally {
    setLoading(false);
  }
};

  const industries = useMemo(
    () => Array.from(new Set(organizations.map((o) => o.industry).filter((v): v is string => !!v))).sort(),
    [organizations]
  );

  const filtered = useMemo(() => {
    const q = searchInput.trim().toLowerCase();
    return organizations.filter((o) => {
      const matchesSector = sector === 'all' || o.industry === sector;
      const matchesQuery =
        !q ||
        o.orgName?.toLowerCase().includes(q) ||
        o.industry?.toLowerCase().includes(q) ||
        o.description?.toLowerCase().includes(q);
      return matchesSector && matchesQuery;
    });
  }, [searchInput, sector, organizations]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-gray-200 rounded-3xl" />
          <div className="h-12 bg-gray-200 rounded-xl max-w-md" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load organizations.</p>
          <button onClick={fetchOrganizations} className="px-4 py-2 bg-tdop-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

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
        {industries.map((s) => (
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
            to={`/browse?organization=${encodeURIComponent(org.orgName)}`}
            className="group bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-card hover:border-tdop-primary/30 transition-all p-6 flex flex-col"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {org.logo ? (
                  <img src={org.logo} alt={org.orgName} className="w-12 h-12 rounded-xl object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-tdop-primary flex items-center justify-center text-white font-bold shrink-0">
                    {org.orgName?.charAt(0) || '?'}
                  </div>
                )}
                <div className="min-w-0">
                  <h2 className="font-semibold text-tdop-navy group-hover:text-tdop-primary transition-colors truncate">
                    {org.orgName}
                  </h2>
                  {org.industry && (
                    <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Briefcase className="w-3 h-3" />
                      <span className="truncate">{org.industry}</span>
                    </p>
                  )}
                </div>
              </div>
              {org.verified ? (
                <Badge className="flex items-center gap-1 bg-green-100 text-green-800" size="sm">
                  <ShieldCheck className="w-3 h-3" />
                  {t('organizations.verified')}
                </Badge>
              ) : (
                <Badge className="flex items-center gap-1 bg-amber-100 text-amber-800" size="sm">
                  {t('organizations.pending')}
                </Badge>
              )}
            </div>

            {org.description && (
              <p className="mt-4 text-sm text-gray-600 line-clamp-3 flex-1">
                {org.description}
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-gray-500">
              {org.size && (
                <div className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-tdop-light">
                  <Users className="w-3.5 h-3.5 text-tdop-primary" />
                  {org.size}
                </div>
              )}
              {org.createdAt && (
                <div className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-tdop-light">
                  <Calendar className="w-3.5 h-3.5 text-tdop-primary" />
                  Est. {new Date(org.createdAt).getFullYear()}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400 truncate max-w-[60%]">
                {org.industry || 'Organization'}
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
            onClick={() => { setSearchInput(''); setSector('all'); }}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tdop-primary text-white text-sm font-medium hover:bg-blue-700 transition-colors"
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
