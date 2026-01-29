import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import heroBg from '@/assets/hero-bg.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 md:px-12 lg:px-20 xl:px-40">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      /> 
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/100" />
      
      {/* Content - Mobile Optimized */}
      <div className="relative z-10 pt-16 sm:pt-20 max-w-2xl w-full text-center">
        {/* Hero Title - Responsive sizing */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#4B0082] font-bold mb-3 sm:mb-4 animate-fade-in-up tracking-wider">
          <span className="block">PATH</span>
          <span className="block">FINDER</span>
        </h1>
        
        {/* Subtitle - Responsive sizing */}
        <p className="text-base sm:text-lg md:text-xl text-[#2E0658]/70 mb-6 sm:mb-8 animate-fade-in-up animation-delay-200 px-4 sm:px-0">
          Your Guide to successful career
        </p>
        
        {/* CTA Buttons - Mobile: Stack, Desktop: Side-by-side */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up animation-delay-400 px-4 sm:px-0">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button 
              variant="hero" 
              size="lg" 
              className="w-full sm:w-auto h-12 sm:h-14 text-sm sm:text-base"
            >
              Explore Careers
            </Button>
          </Link>
          <Link to="/About" className="w-full sm:w-auto">
            <Button 
              className="text-black w-full sm:w-auto h-12 sm:h-14 text-sm sm:text-base" 
              variant="hero-outline" 
              size="lg"
            >
              About Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;