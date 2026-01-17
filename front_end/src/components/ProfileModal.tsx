import { useState, useEffect } from 'react';
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
  X,
  Edit
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="flex gap-3 pt-4 border-t border-border/30">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              // Navigate to edit profile
              onClose();
              // You can add navigation to edit page here
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="accent"
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}