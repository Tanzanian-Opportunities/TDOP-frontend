import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialSlider: React.FC = () => {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);

  const testimonialNames = [
    t('landing.testimonial1Name'),
    t('landing.testimonial2Name'),
    t('landing.testimonial3Name'),
  ];

  const testimonials = testimonialNames
    .filter(name => name && !name.startsWith('landing.'))
    .map((name, i) => ({
      name,
      role: t(`landing.testimonial${i + 1}Role`),
      quote: t(`landing.testimonial${i + 1}Quote`),
    }));

  if (testimonials.length === 0) return null;

  const total = testimonials.length;

  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => setIndex(prev => (prev + 1) % total), 7000);
    return () => clearInterval(id);
  }, [total]);

  const prev = () => setIndex(i => (i - 1 + total) % total);
  const next = () => setIndex(i => (i + 1) % total);
  const item = testimonials[index];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-tdop-cyan">
          {t('landing.testimonialsSubtitle')}
        </span>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold text-tdop-royal">
          {t('landing.testimonialsTitle')}
        </h2>
      </div>

      <div className="relative max-w-3xl mx-auto">
        <div className="rounded-3xl border border-gray-100 bg-tdop-light p-8 sm:p-10 text-center animate-fade-in">
          <Quote className="w-10 h-10 mx-auto text-tdop-gold" />
          <p className="mt-6 text-lg sm:text-xl text-gray-700 leading-relaxed">"{item.quote}"</p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full bg-tdop-primary/20 flex items-center justify-center text-tdop-royal font-bold text-xl">
              {item.name.charAt(0)}
            </div>
            <div className="text-left">
              <p className="font-display font-semibold text-tdop-royal">{item.name}</p>
              <p className="text-sm text-gray-500">{item.role}</p>
            </div>
          </div>
        </div>

        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="absolute left-0 sm:-left-16 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-soft flex items-center justify-center text-tdop-primary hover:bg-tdop-primary hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="absolute right-0 sm:-right-16 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white border border-gray-200 shadow-soft flex items-center justify-center text-tdop-primary hover:bg-tdop-primary hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {total > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === index ? 'bg-tdop-gold w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialSlider;