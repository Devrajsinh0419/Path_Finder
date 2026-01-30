import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react'; // Make sure this is here!
import { Button } from './ui/button';
import { GraduationCap } from 'lucide-react';

const WhatIsSection = () => {

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // This stops the browser from jumping to the middle of the page on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // observer.unobserve(entry.target); // Optional: keep it true once triggered
        }
        else {
          setIsVisible(false); // Resets when scrolling UP out of view
        }
      },
      { threshold: 0.1 ,
        rootMargin: "0px 0px -50px 0px"
      }
      
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className={`glass-card p-8 md:p-12 relative overflow-hidden rounded-2xl transition-all duration-1000 ease-out 
          bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
          
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="flex-1">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                What is <span className="gradient-text">PathFinder</span>
              </h2>
              
              <p className="text-foreground/80 leading-relaxed mb-6">
                PathFinder is a smart academic guidance platform for diploma students.
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
