import { Link } from 'react-router-dom';
import { Sparkles, LogOut, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Stars from '@/components/Stars';
import heroBg from '@/assets/hero-bg.png';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const navItems = ['Career', 'Resources', 'Performance', 'Profile'];

interface AcademicProfile {
  full_name?: string;
  enrollment_no?: string;
  college_name?: string;
  current_semester?: number;
  is_completed?: boolean;
}

interface UserProfile {
  email: string;
  username?: string;
  role: string;
  first_name: string;
  last_name: string;
  id: number;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [academicProfile, setAcademicProfile] = useState<AcademicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        console.log('=== PROFILE DEBUG START ===');
        console.log('1. Stored user:', storedUser);
        
        if (storedUser) {
          const basicUser = JSON.parse(storedUser);
          setUser(basicUser);
          console.log('2. Parsed user:', basicUser);
          
          try {
            console.log('3. Fetching from /accounts/profile/...');
            const response = await api.get('/accounts/profile/');
            
            console.log('4. Full Response:', response);
            console.log('5. Response.data:', response.data);
            console.log('6. Response.data.user:', response.data?.user);
            console.log('7. Response.data.profile:', response.data?.profile);
            
            setDebugInfo(JSON.stringify(response.data, null, 2));
            
            if (response.data) {
              const userData = response.data.user;
              const profileData = response.data.profile;
              
              console.log('8. Extracted userData:', userData);
              console.log('9. Extracted profileData:', profileData);
              
              if (userData) {
                setUser(userData);
              }
              
              if (profileData) {
                console.log('10. Setting academic profile:', profileData);
                setAcademicProfile(profileData);
                setProfileComplete(profileData.is_completed || false);
                console.log('11. Profile complete status:', profileData.is_completed);
              } else {
                console.log('10. No profile data found');
              }
            }
            console.log('=== PROFILE DEBUG END ===');
          } catch (apiError: any) {
            console.error('API Error:', apiError);
            console.error('Error response:', apiError.response);
            setProfileComplete(false);
            setError(apiError.response?.data?.error || apiError.message || 'Failed to fetch profile');
          }
        } else {
          console.log('No stored user found');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-background/70" />
      <Stars />
      
      <div className="relative z-10 min-h-screen px-4 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="font-display text-xl font-bold tracking-wider text-accent">
              PATHFINDER
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                to={item === 'Profile' ? '/profile' : `/${item.toLowerCase()}`}
                key={item}
                className="text-foreground/70 hover:text-foreground transition-colors text-sm font-medium"
              >
                {item}
              </Link>
            ))}
            {user && <span className="text-foreground/70">{user.first_name} {user.last_name}</span>}
          </nav>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="glass-card p-4 mb-4 bg-blue-500/10 border border-blue-500/30">
            <p className="text-xs font-mono text-blue-400 mb-2">Debug - API Response:</p>
            <pre className="text-xs text-blue-300 overflow-auto max-h-40">{debugInfo}</pre>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="glass-card p-4 mb-4 bg-red-500/10 border border-red-500/30">
            <p className="text-red-500 text-sm">⚠️ {error}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="glass-card p-6 mb-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold">Your Profile</h2>
            <Link to="/complete-profile">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                {profileComplete ? 'Edit Profile' : 'Complete Profile'}
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-foreground/80">Loading profile...</p>
            </div>
          ) : user ? (
            <div className="space-y-6">
              {/* Debug Section */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <p className="text-xs font-mono text-purple-400 mb-2">Debug Info:</p>
                <p className="text-xs text-purple-300">Profile Complete: {String(profileComplete)}</p>
                <p className="text-xs text-purple-300">Academic Profile Exists: {academicProfile ? 'Yes' : 'No'}</p>
                {academicProfile && (
                  <>
                    <p className="text-xs text-purple-300">Full Name: {academicProfile.full_name || 'null'}</p>
                    <p className="text-xs text-purple-300">Enrollment: {academicProfile.enrollment_no || 'null'}</p>
                    <p className="text-xs text-purple-300">College: {academicProfile.college_name || 'null'}</p>
                    <p className="text-xs text-purple-300">Semester: {academicProfile.current_semester || 'null'}</p>
                  </>
                )}
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wider">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background/30 p-4 rounded-lg">
                    <p className="text-xs text-foreground/60 mb-1 uppercase tracking-wide">Email Address</p>
                    <p className="text-foreground/90">{user.email}</p>
                  </div>
                  <div className="bg-background/30 p-4 rounded-lg">
                    <p className="text-xs text-foreground/60 mb-1 uppercase tracking-wide">Name</p>
                    <p className="text-foreground/90">{user.first_name} {user.last_name}</p>
                  </div>
                  <div className="bg-background/30 p-4 rounded-lg">
                    <p className="text-xs text-foreground/60 mb-1 uppercase tracking-wide">Role</p>
                    <p className="text-foreground/90 capitalize">{user.role || 'Student'}</p>
                  </div>
                  <div className="bg-background/30 p-4 rounded-lg">
                    <p className="text-xs text-foreground/60 mb-1 uppercase tracking-wide">User ID</p>
                    <p className="text-foreground/90">{user.id}</p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              {profileComplete && academicProfile ? (
                <div>
                  <h3 className="text-sm font-semibold text-accent mb-4 uppercase tracking-wider">
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {academicProfile.full_name && (
                      <div className="bg-background/30 p-4 rounded-lg">
                        <p className="text-xs text-foreground/60 mb-1 uppercase tracking-wide">Full Name</p>
                        <p className="text-foreground/90">{academicProfile.full_name}</p>
                      </div>
                    )}
                    {academicProfile.enrollment_no && (
                      <div className="bg-background/30 p-4 rounded-lg">
                        <p className="text-xs text-foreground/60 mb-1 uppercase tracking-wide">Enrollment Number</p>
                        <p className="text-foreground/90">{academicProfile.enrollment_no}</p>
                      </div>
                    )}
                    {academicProfile.college_name && (
                      <div className="bg-background/30 p-4 rounded-lg">
                        <p className="text-xs text-foreground/60 mb-1 uppercase tracking-wide">College Name</p>
                        <p className="text-foreground/90">{academicProfile.college_name}</p>
                      </div>
                    )}
                    {academicProfile.current_semester && (
                      <div className="bg-background/30 p-4 rounded-lg">
                        <p className="text-xs text-foreground/60 mb-1 uppercase tracking-wide">Current Semester</p>
                        <p className="text-foreground/90">Semester {academicProfile.current_semester}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Profile Incomplete Warning */
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">
                        Profile Incomplete
                      </h4>
                      <p className="text-sm text-yellow-600/80 dark:text-yellow-400/80 mb-4">
                        Complete your academic profile to unlock personalized recommendations and track your progress.
                      </p>
                      <Link to="/complete-profile">
                        <Button variant="default" size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                          Complete Profile Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <div className="pt-6 border-t border-foreground/10">
                <Button variant="destructive" size="default" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-foreground/80 mb-4">No user data found.</p>
              <Link to="/login">
                <Button variant="accent">Go to Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;