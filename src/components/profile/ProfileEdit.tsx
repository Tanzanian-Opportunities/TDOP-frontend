import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { profileApi } from '@/services/api/profileApi';
import { Save, Eye, EyeOff, Building2, Lock, Bell, BellOff, Info, Camera, MapPin, Globe, Linkedin, Github } from 'lucide-react';

export const ProfileEdit: React.FC = () => {
  const { t } = useTranslation();
  const { refreshUser } = useAuth();
  const { profileData } = useProfile();
  const profile = (profileData || {}) as Record<string, any>;
  const [success, setSuccess] = useState(false);
  const [headline, setHeadline] = useState(profile.headline || '');
  const [summary, setSummary] = useState(profile.summary || '');
  const [location, setLocation] = useState(profile.location || '');
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || '');
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile.websiteUrl || '');
  const [visibility, setVisibility] = useState(profile.profileVisibility || 'PUBLIC');
  const [notifPref, setNotifPref] = useState(profile.notificationPreference || 'ALL');
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = async () => {
    try {
      setSavingSection('profile');
      await profileApi.updateProfile({ headline, summary, portfolioUrl, linkedinUrl, githubUrl, websiteUrl });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { /* empty */ } finally {
      setSavingSection(null);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      await profileApi.uploadAvatar(file);
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { /* empty */ } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveVisibility = async (value: string) => {
    try {
      setSavingSection('visibility');
      await profileApi.updateVisibility(value);
      setVisibility(value);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { /* empty */ } finally {
      setSavingSection(null);
    }
  };

  const handleSaveNotifPref = async (value: string) => {
    try {
      setSavingSection('notif');
      await profileApi.updateNotificationPreference(value);
      setNotifPref(value);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { /* empty */ } finally {
      setSavingSection(null);
    }
  };

  const visOptions = [
    { value: 'PUBLIC', label: 'Public', desc: 'Anyone can see your name, education, skills, and experience', icon: Eye },
    { value: 'ORGANIZATIONS_ONLY', label: 'Organizations Only', desc: 'Only verified organizations can see your profile', icon: Building2 },
    { value: 'PRIVATE', label: 'Private', desc: 'Only you can see your full profile', icon: Lock },
  ];

  const notifOptions = [
    { value: 'ALL', label: 'All Notifications', desc: 'Application updates, deadline reminders, and new opportunities', icon: Bell },
    { value: 'IMPORTANT_ONLY', label: 'Important Only', desc: 'Only application status changes and deadline alerts', icon: Info },
    { value: 'NONE', label: 'No Notifications', desc: 'Turn off all in-app notifications', icon: BellOff },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-tdop-navy">Edit Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your profile information and preferences</p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          Profile updated successfully!
        </div>
      )}

      {/* Avatar */}
      <Card>
        <h3 className="font-semibold text-tdop-navy mb-4">Profile Photo</h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-tdop-primary flex items-center justify-center text-white text-2xl font-bold overflow-hidden flex-shrink-0">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span>{profile.headline?.[0] || 'U'}</span>
            )}
          </div>
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} loading={avatarUploading}>
              <Camera className="w-4 h-4 mr-1.5" /> Upload photo
            </Button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG. Max 2MB.</p>
          </div>
        </div>
      </Card>

      {/* Basic Info */}
      <Card>
        <h3 className="font-semibold text-tdop-navy mb-4">Basic Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
            <input
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              placeholder="e.g. Software Engineer | React & Node.js"
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-tdop-navy focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About you</label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Tell organizations about yourself..."
              rows={4}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-tdop-navy focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Dar es Salaam, Tanzania"
                className="w-full pl-10 pr-4 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-tdop-navy focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} loading={savingSection === 'profile'}>
              <Save className="w-4 h-4 mr-1.5" /> Save
            </Button>
          </div>
        </div>
      </Card>

      {/* Social Links */}
      <Card>
        <h3 className="font-semibold text-tdop-navy mb-4">Links & Portfolio</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio URL</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={portfolioUrl}
                onChange={e => setPortfolioUrl(e.target.value)}
                placeholder="https://yourportfolio.com"
                className="w-full pl-10 pr-4 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-tdop-navy focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="w-full pl-10 pr-4 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-tdop-navy focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourusername"
                className="w-full pl-10 pr-4 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-tdop-navy focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full pl-10 pr-4 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-tdop-navy focus:border-tdop-primary focus:ring-1 focus:ring-tdop-primary"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} loading={savingSection === 'profile'}>
              <Save className="w-4 h-4 mr-1.5" /> Save links
            </Button>
          </div>
        </div>
      </Card>

      {/* Visibility */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-tdop-primary" />
          <h3 className="font-semibold text-tdop-navy">Profile Visibility</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Control who can see your profile information</p>
        <div className="space-y-2">
          {visOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = visibility === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSaveVisibility(opt.value)}
                disabled={savingSection === 'visibility'}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-tdop-primary bg-tdop-primary/5 ring-1 ring-tdop-primary/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-tdop-primary text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className={`font-medium text-sm ${isSelected ? 'text-tdop-primary' : 'text-tdop-navy'}`}>{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
                {isSelected && (
                  <div className="ml-auto shrink-0">
                    <div className="w-5 h-5 rounded-full bg-tdop-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-tdop-accent" />
          <h3 className="font-semibold text-tdop-navy">Notification Preferences</h3>
        </div>
        <p className="text-sm text-gray-500 mb-4">Choose which notifications you receive</p>
        <div className="space-y-2">
          {notifOptions.map(opt => {
            const Icon = opt.icon;
            const isSelected = notifPref === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSaveNotifPref(opt.value)}
                disabled={savingSection === 'notif'}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-tdop-accent bg-amber-50/50 ring-1 ring-tdop-accent/20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? 'bg-tdop-accent text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className={`font-medium text-sm ${isSelected ? 'text-amber-700' : 'text-tdop-navy'}`}>{opt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
                {isSelected && (
                  <div className="ml-auto shrink-0">
                    <div className="w-5 h-5 rounded-full bg-tdop-accent flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
