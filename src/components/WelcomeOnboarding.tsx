import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { User, FileText, Search, Sparkles, ArrowRight, Check } from 'lucide-react';

const steps = [
  {
    icon: User,
    title: 'Complete your profile',
    description: 'Add your skills, education, and experience so we can match you with the best opportunities.',
    color: 'bg-tdop-primary/10 text-tdop-primary',
    to: '/profile',
  },
  {
    icon: FileText,
    title: 'Upload your documents',
    description: 'Upload your CV, certificates, and cover letters to apply faster.',
    color: 'bg-emerald-50 text-tdop-secondary',
    to: '/documents',
  },
  {
    icon: Search,
    title: 'Discover opportunities',
    description: 'Browse scholarships, jobs, internships, and training programs across Tanzania.',
    color: 'bg-amber-50 text-amber-600',
    to: '/browse',
  },
  {
    icon: Sparkles,
    title: 'Get personalized matches',
    description: 'Complete your profile to receive AI-powered opportunity recommendations.',
    color: 'bg-purple-50 text-purple-600',
    to: '/recommendations',
  },
];

const WelcomeOnboarding: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem('tdop-onboarding-dismissed');
    const profileCompleted = localStorage.getItem('tdop-profile-completed');
    if (!dismissed && !profileCompleted) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('tdop-onboarding-dismissed', 'true');
    setShow(false);
  };

  const handleComplete = () => {
    localStorage.setItem('tdop-profile-completed', 'true');
    setShow(false);
  };

  if (!show) return null;

  const step = steps[currentStep];
  const Icon = step.icon;
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-label="Welcome to TDOP">
      <div className="bg-white rounded-3xl shadow-elevated w-full max-w-md overflow-hidden animate-modal-in">
        <div className="p-8 text-center">
          <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4`}>
            <Icon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-tdop-navy mb-2">
            {currentStep === 0 ? `Welcome, ${user?.firstName || 'there'}!` : step.title}
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>

          <div className="flex items-center justify-center gap-2 mt-6">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentStep ? 'bg-tdop-primary' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-8 pb-8">
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            Skip for now
          </Button>
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(s => s - 1)}>
                Back
              </Button>
            )}
            <Button
              size="sm"
              onClick={() => {
                if (isLast) {
                  handleComplete();
                  navigate(step.to);
                } else {
                  navigate(step.to);
                  setCurrentStep(s => s + 1);
                }
              }}
            >
              {isLast ? 'Get started' : 'Continue'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOnboarding;
