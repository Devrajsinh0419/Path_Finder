

import { useEffect, useRef, useState } from 'react';
import { BarChart3, LayoutDashboard, Target, Compass } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'Smart Grade Analysis', description: 'Automatic marks analysis that evaluates your strengths, weak spots, and improvement areas.' },
  { icon: LayoutDashboard, title: 'Personalized Dashboard', description: 'All your progress in one place — performance graphs, semester-wise statistics, and more.' },
  { icon: Target, title: 'Skills & Strength Mapping', description: 'Identify your core strengths, soft skills, and hard skills, grouped into easy-to-understand categories.' },
  { icon: Compass, title: 'Roadmap Guidance', description: 'Know where to focus your skills to build, and what domains fit you as you progress.' },
];

// 1. Separate Card Component to handle individual scroll logic
const FeatureCard = ({ feature, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false); // Resets when you scroll up
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl transition-all duration-700 ease-out group
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ 
        // 2. STAGGERED DELAY: Each card waits a bit longer than the previous one
        transitionDelay: isVisible ? `${index * 150}ms` : '0ms' 
      }}
    >
      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
        <feature.icon className="w-7 h-7 text-accent" />
      </div>
      <h3 className="font-display text-lg font-semibold mb-3">{feature.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
          Features of <span className="gradient-text">PathFinder</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
