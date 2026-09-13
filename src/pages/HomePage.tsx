import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '@/components/landing/HeroSection';
import ProcessSteps from '@/components/landing/ProcessSteps';
import WhyTDOP from '@/components/landing/WhyTDOP';
import CategoryGrid from '@/components/landing/CategoryGrid';
import FeaturedFeed from '@/components/landing/FeaturedFeed';
import TrustSection from '@/components/landing/TrustSection';
import ImpactStats from '@/components/landing/ImpactStats';
import TestimonialSlider from '@/components/landing/TestimonialSlider';
import CtaSection from '@/components/landing/CtaSection';

const HomePage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.hash]);

  return (
    <div>
      <HeroSection />
      <ProcessSteps />
      <WhyTDOP />
      <CategoryGrid />
      <FeaturedFeed />
      <TrustSection />
      <ImpactStats />
      <TestimonialSlider />
      <CtaSection />
    </div>
  );
};

export default HomePage;
