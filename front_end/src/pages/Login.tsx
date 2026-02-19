import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Eye, EyeOff } from 'lucide-react'; 
import Stars from '@/components/Stars';
import heroBg from '@/assets/login.svg';
import api from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login/', {
        email,
        password,
      });

      // Store tokens
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
      }
      if (response.data.refresh) {
        localStorage.setItem('refresh_token', response.data.refresh);
      }

      // Store user data
      const userData = {
        id: response.data.id || response.data.user?.id,
        email: response.data.email,
        first_name: response.data.first_name,
        last_name: response.data.last_name,
        role: response.data.role,
      };
      localStorage.setItem('user', JSON.stringify(userData));

      toast({
        title: 'Login successful!',
        description: 'Welcome back!',
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.detail) {
          setError(errorData.detail);
        } else if (errorData.non_field_errors) {
          setError(errorData.non_field_errors[0]);
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Stars />
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-center bg-cover h-screen align-left padding-0 margin-0"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
          {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/10  via-transparent to-background/100" />
        
        
        
        <div className="relative z-10 flex flex-col items-start ut-2 justify-start pt-5 px-11">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <span className="font-display text-2xl font-bold tracking-wider">
              PathFinder
            </span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            <span className="gradient-text">Welcome back to</span>
            <br />
            <span className="gradient-text">Your Journey</span>
          </h1>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background/100 relative">
        <Stars ></Stars>
        
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="lg:hidden flex items-center gap-2 mb-8">
              <Sparkles className="w-6 h-6 text-accent" />
              <span className="font-display text-xl font-bold">PathFinder</span>
            </div>
          </Link>

          {/* Tabs */}
          <div className="flex gap-8 mb-8 border-b border-border/30">
            <Link
              to="/login"
              className="pb-3 text-foreground font-medium border-b-2 border-foreground"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="pb-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign Up
            </Link>
          </div>

          <div className="backdrop-blur-2xl rounded-2xl p-8 shadow-lg glass-card-strong border border-white/30">
            <h2 className="font-display text-3xl font-bold mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Login to your PathFinder account
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-500 text-sm text-center">{error}</p>
                </div>
              )}

              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password field with toggle */}
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <Button 
                type="submit" 
                variant="accent" 
                size="lg" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>

            <p className="text-center text-muted-foreground mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-foreground font-semibold hover:text-accent transition-colors">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;