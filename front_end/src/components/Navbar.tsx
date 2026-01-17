import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors duration-300">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <span className="font-display text-xl font-bold text-foreground tracking-wider">
            PathFinder
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link text-sm font-medium ${
                location.pathname === link.path ? 'text-foreground' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="nav" size="sm">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
