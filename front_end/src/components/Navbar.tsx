import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the home page
    if (location.pathname !== '/') {
      // Navigate to home page first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsOpen(false); // Close mobile menu if open
  };

  const navItems = [
    { label: 'Features', sectionId: 'features' },
    { label: 'About', sectionId: 'about' },
    { label: 'How it Works', sectionId: 'how-it-works' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md ">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - Responsive sizing */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
            </div>
            <span className="font-display text-black font-bold tracking-wider text-sm sm:text-base size-large">
              PATHFINDER
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on mobile/tablet */}
          <div className="hidden md:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className="text-sm text-[#2E0658]/70 hover:text-accent transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons - Hidden on mobile/tablet */}
          <div className="hidden md:flex items-center gap-3 xl:gap-4 text-[#2E0658]/80">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-sm">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="accent" size="sm" className="text-sm">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button - Show on mobile/tablet */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2  rounded-lg hover:bg-accent/10 transition-colors text-black"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu - Slide down animation */}
        {isOpen && (
          <div className="md:hidden py-3 sm:py-4 space-y-2 animate-fade-in border-t border-border/10 ">
            {navItems.map((item) => (
              <button
                key={item.sectionId}
                onClick={() => scrollToSection(item.sectionId)}
                className="block w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-[#2E0658]/80 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
            
            {/* Mobile Auth Buttons */}
            <div className="pt-3 sm:pt-4 border-t border-border/10 space-y-2">
              <Link to="/login" className="block" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full h-10 text-[#2E0658]/80 sm:h-11 text-sm sm:text-base">
                  Login
                </Button>
              </Link>
              <Link to="/signup" className="block" onClick={() => setIsOpen(false)}>
                <Button variant="accent" className="w-full h-10 sm:h-11 text-sm sm:text-base">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;