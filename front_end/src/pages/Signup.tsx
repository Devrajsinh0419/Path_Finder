import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import Stars from '@/components/Stars';
import heroBg from '@/assets/signup.svg';
import api from '@/lib/api';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/register/', {
        first_name: firstName,
        last_name: lastName,
        email,  
        password,
        password2: confirmPassword,
        role: 'student',
      });
      
      // Save tokens
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      }
      
      // Save user data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      navigate('/input-details');
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.email) {
          setError(`Email: ${errorData.email[0]}`);
        } else if (errorData.password) {
          setError(`Password: ${errorData.password[0]}`);
        } else if (errorData.first_name) {
          setError(`First Name: ${errorData.first_name[0]}`);
        } else if (errorData.last_name) {
          setError(`Last Name: ${errorData.last_name[0]}`);
        } else {
          setError('Failed to sign up. Please try again.');
        }
      } else {
        setError('Failed to sign up. Please try again.');
      }
      console.error('Signup failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setError('');
    
    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Send to backend
      const response = await api.post('/auth/google-auth/', {
        idToken: idToken
      });
      
      // Save tokens
      if (response.data.tokens) {
        localStorage.setItem('access_token', response.data.tokens.access);
        localStorage.setItem('refresh_token', response.data.tokens.refresh);
      }
      
      // Save user data
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Navigate to input details
      navigate('/input-details');
      
    } catch (err: any) {
      console.error('Google signup error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up blocked. Please allow pop-ups for this site.');
      } else {
        setError('Failed to sign up with Google. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <Stars />
      
      {/* Left Panel - Branding (Desktop Only) */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/100" />
        
        {/* Branding Content */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>
            <span className="font-display text-2xl font-bold tracking-wider">
              PathFinder
            </span>
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-center">
            <span className="gradient-text">Embark on your</span>
            <br />
            <span className="gradient-text">Journey today</span>
          </h1>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12 bg-background relative">
        <Stars />
        
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6 sm:mb-8">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
            <span className="font-display text-lg sm:text-xl font-bold">PathFinder</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 sm:gap-8 mb-6 sm:mb-8 border-b border-border/30">
            <Link
              to="/login"
              className="pb-3 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="pb-3 text-sm sm:text-base text-foreground font-medium border-b-2 border-foreground"
            >
              Sign Up
            </Link>
          </div>

          {/* Form Card */}
          <div className="backdrop-blur-2xl rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-lg glass-card-strong border border-white/30">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2 text-center">
              Get Started
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground text-center mb-6 sm:mb-8">
              Sign up to your new PathFinder account
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <p className="text-red-500 text-xs sm:text-sm text-center">{error}</p>
                </div>
              )}
              
              {/* Name Fields */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  className="h-10 sm:h-12 text-sm sm:text-base"
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  className="h-10 sm:h-12 text-sm sm:text-base"
                />
              </div>
              
              {/* Email */}
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  className="h-10 sm:h-12 text-sm sm:text-base"
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
                  disabled={loading || googleLoading}
                  className="h-10 sm:h-12 text-sm sm:text-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  disabled={loading || googleLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              
              {/* Confirm Password field with toggle */}
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                  className="h-10 sm:h-12 text-sm sm:text-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  disabled={loading || googleLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  className="mt-0.5 border-muted-foreground data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  disabled={loading || googleLoading}
                />
                <label htmlFor="terms" className="text-muted-foreground text-xs sm:text-sm cursor-pointer leading-tight">
                  I Agree to the Terms & Conditions
                </label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                variant="accent" 
                size="lg" 
                className="w-full h-11 sm:h-12 text-sm sm:text-base" 
                disabled={loading || googleLoading || !agreeTerms}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Signing up...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/30"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign-In Button */}
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full h-11 sm:h-12 text-sm sm:text-base"
                onClick={handleGoogleSignup}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin mr-2" />
                    Signing in with Google...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-5 sm:mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-foreground font-semibold hover:text-accent transition-colors">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;