import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import heroBg from '@/assets/hero-bg.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-start justify-center overflow-hidden px-20 md:px-40">
      
      {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        /> 
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30  via-transparent to-background/20 " />

      {/* Content */}
      <div className="relative z-10  pt-20 max-w-2xl">
        <h1 className="font-display text-6xl text-[#b4b4ff] md:text-8xl font-bold mb-4 animate-fade-in-up tracking-wider">
          <span className="block">PATH</span>
          <span className="block">FINDER</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#b4b4ff]/70 mb-8 animate-fade-in-up animation-delay-200 text-left">
          Your Guide to successful career
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
          <Link to="/signup">
            <Button variant="hero" size="lg">
              Explore Careers
            </Button>
          </Link>
          <Link to="/About">
            <Button className='text-white' variant="hero-outline" size="lg">
              About Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
