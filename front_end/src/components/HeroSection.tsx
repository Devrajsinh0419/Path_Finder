import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/80" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 pt-20">
        <h1 className="font-display text-6xl md:text-8xl font-bold mb-4 animate-fade-in-up tracking-wider">
          <span className="block">PATH</span>
          <span className="block">FINDER</span>
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/80 mb-8 animate-fade-in-up animation-delay-200">
          Your Guide to successful career
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
          <Link to="/input-details">
            <Button variant="hero" size="lg">
              Explore Careers
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="hero-outline" size="lg">
              About Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
