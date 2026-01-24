import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { GraduationCap } from 'lucide-react';

const WhatIsSection = () => {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card p-8 md:p-12 relative overflow-hidden rounded-2xl">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                What is <span className="gradient-text">PathFinder</span>
              </h2>
              
              <p className="text-foreground/80 leading-relaxed mb-6">
                PathFinders is a smart academic guidance platform for diploma students.
                It analyzes your marks, identifies strengths and weaknesses, and recommends 
                the best career domain for you.
              </p>

              <Link to="/signup">
                <Button variant="hero" size="default">
                  Get Started
                </Button>
              </Link>
            </div>

            <div className="flex-shrink-0 opacity-40">
              <GraduationCap className="w-32 h-32 text-accent" strokeWidth={1} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsSection;
