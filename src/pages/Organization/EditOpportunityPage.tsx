import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { opportunityApi } from '@/services/api/opportunityApi';
import { Opportunity } from '@/types/opportunity';
import { useNotificationContext } from '@/context/NotificationContext';
import { Save, ArrowLeft, Briefcase, MapPin, Calendar, FileText, Tag } from 'lucide-react';

const EditOpportunityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addNotification } = useNotificationContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<string>('full-time');
  const [location, setLocation] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('');
  const [requirements, setRequirements] = useState('');

  useEffect(() => {
    if (id) fetchOpportunity(id);
  }, [id]);

  const fetchOpportunity = async (oppId: string) => {
    try {
      setLoading(true);
      const response = await opportunityApi.getOpportunity(oppId);
      const opp = response?.data;
      if (!opp) {
        setError('Opportunity not found');
        return;
      }
      setTitle(opp.title || '');
      setDescription(opp.description || '');
      setType(opp.type || 'full-time');
      setLocation(opp.location || '');
      setDeadline(opp.applicationDeadline ? opp.applicationDeadline.split('T')[0] : '');
      setCategory(opp.category || '');
      setRequirements(Array.isArray(opp.requirements) ? opp.requirements.join('\n') : '');
    } catch (err) {
      setError('Failed to load opportunity');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);
    try {
      await opportunityApi.updateOpportunity(id, {
        title,
        description,
        type: type as any,
        location,
        applicationDeadline: deadline,
        category,
        requirements: requirements.split('\n').filter(Boolean),
        isRemote: false,
        experienceLevel: 'mid',
        skills: [],
        tags: [],
        responsibilities: [],
        benefits: [],
        educationLevel: '',
      });
      addNotification({ type: 'success', title: 'Updated', message: 'Opportunity updated successfully.' });
      navigate('/my-jobs');
    } catch {
      addNotification({ type: 'error', title: 'Error', message: 'Failed to update opportunity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/my-jobs')}>Back to Dashboard</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-slide-up">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-tdop-navy">{t('nav.create')}</h1>
          <p className="text-gray-500 mt-1">Edit opportunity #{id}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-5 p-6">
            <div>
              <label className="block text-sm font-medium text-tdop-navy mb-1.5">Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Job title"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-tdop-navy mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Describe the opportunity..."
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-1.5">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="apprenticeship">Apprenticeship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-1.5">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, Country"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-1.5">Deadline</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-tdop-navy mb-1.5">Category</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Technology, Education"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-tdop-navy mb-1.5">Requirements (one per line)</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={4}
                  placeholder={"Bachelor's degree\n2+ years experience\nProficiency in React"}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-tdop-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-tdop-primary/20 focus:border-tdop-primary resize-none"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {t('common.save')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditOpportunityPage;
