import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, 
  Mail, 
  Hash, 
  GraduationCap, 
  BookOpen,
  Calendar,
  Edit,
  LogOut
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProfile();
    }
  }, [isOpen]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/accounts/profile/');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggingOut(true);
    
    // Clear all stored data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Show success message
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of your account',
    });
    
    // Close modal and redirect to login
    onClose();
    setTimeout(() => {
      navigate('/login');
    }, 500);
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!profile) return null;

  const getInitials = () => {
    if (profile.user.first_name && profile.user.last_name) {
      return `${profile.user.first_name[0]}${profile.user.last_name[0]}`.toUpperCase();
    }
    return profile.user.email[0].toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Your Profile</DialogTitle>
          <DialogDescription>
            View and manage your account information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Avatar */}
          <div className="flex items-center gap-4 pb-4 border-b border-border/30">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {getInitials()}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">
                {profile.user.first_name} {profile.user.last_name}
              </h3>
              <p className="text-sm text-muted-foreground capitalize">
                {profile.user.role}
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              Personal Information
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5">
                <Mail className="w-5 h-5 text-accent mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{profile.user.email}</p>
                </div>
              </div>

              {profile.profile.full_name && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5">
                  <User className="w-5 h-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{profile.profile.full_name}</p>
                  </div>
                </div>
              )}

              {profile.profile.enrollment_no && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5">
                  <Hash className="w-5 h-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Enrollment Number</p>
                    <p className="font-medium">{profile.profile.enrollment_no}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-accent" />
              Academic Information
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              {profile.profile.college_name && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5">
                  <BookOpen className="w-5 h-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Institute</p>
                    <p className="font-medium">{profile.profile.college_name}</p>
                  </div>
                </div>
              )}

              {profile.profile.current_semester && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5">
                  <Calendar className="w-5 h-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Current Semester</p>
                    <p className="font-medium">Semester {profile.profile.current_semester}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile Status */}
          <div className="pt-4 border-t border-border/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${profile.profile.is_completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-sm text-muted-foreground">
                  Profile Status: {profile.profile.is_completed ? 'Complete' : 'Incomplete'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/30">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              // You can add navigation to edit page here
              // navigate('/edit-profile');
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          
          <Button
            variant="destructive"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
            <div className="bg-background p-6 rounded-lg max-w-sm mx-4 space-y-4">
              <h3 className="font-bold text-lg">Confirm Logout</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to logout?
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLogoutConfirm(false)}
                > 
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </Button>
              </div>
            </div>
          </div>
        )}  
      </DialogContent>
    </Dialog>
  );
}