import { useToast } from "@/components/ui/use-toast";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Sparkles, GraduationCap, Hash, Calendar, BookOpen, Code, TrendingUp } from 'lucide-react';
import Stars from '@/components/Stars';
import heroBg from '@/assets/hero-bg.png';

const InputDetails = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    enrollmentNo: "",
    collegeName: "",
    semester: "",
    year: "",
    branch: "",
    skills: "",
    selfRating: [5],
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const semesterNumber = formData.semester
        ? parseInt(formData.semester.replace(/\D/g, ''), 10)
        : null

      // Save to the UserProfile model that the modal uses
      await api.post("/accounts/complete-profile/", {
        full_name: `${formData.firstName} ${formData.lastName}`,
        enrollment_no: formData.enrollmentNo,
        college_name: formData.collegeName,
        current_semester: semesterNumber,
      })
      
      await api.post("/academics/student-profile/", {
        full_name: `${formData.firstName} ${formData.lastName}`,
        enrollment_number: formData.enrollmentNo,
        institute_name: formData.collegeName,
        current_semester: semesterNumber,
        interests: formData.skills,
      })
      
      toast({
        title: "Profile Submitted",
        description: "Your profile has been successfully submitted.",
      })
      navigate("/skill-assessment", {
        state: {
          skills: formData.skills,
        },
      })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your profile.",
        variant: "destructive",
      })
      console.error("Error submitting profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <Stars />

      {/* Mobile: smaller padding, Desktop: larger padding */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-12">
        <div className="w-full max-w-4xl animate-fade-in-up">
          {/* Header - Mobile Optimized */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full glass-card flex items-center justify-center hover:bg-glass/70 transition-all hover:scale-105"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
              </div>
              <span className="font-display text-base sm:text-xl font-bold tracking-wider">
                PATHFINDER
              </span>
            </Link>
          </div>

          {/* Form Card - Mobile: smaller padding, Desktop: larger padding */}
          <div className="glass-card-strong rounded-xl sm:rounded-2xl p-4 sm:p-8 md:p-10">
            <div className="mb-6 sm:mb-8">
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 gradient-text">
                Complete Your Profile
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Help us personalize your learning journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  <h2 className="text-base sm:text-lg font-semibold">Personal Information</h2>
                </div>

                {/* Mobile: 1 column, Desktop: 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                      First Name
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                      Last Name
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="h-10 sm:h-12 text-sm sm:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Enrollment Number
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., 2303396160001"
                    value={formData.enrollmentNo}
                    onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                    className="h-10 sm:h-12 text-sm sm:text-base w-full sm:max-w-md"
                    required
                  />
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  <h2 className="text-base sm:text-lg font-semibold">Academic Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-foreground">
                      Current Semester
                    </label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => setFormData({ ...formData, semester: value })}
                    >
                      <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {['1st', '2nd', '3rd', '4th', '5th', '6th'].map((sem) => (
                          <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      College/Institute Name
                      <span className="text-red-500">*</span>
                    </label>
                    <Select
                      value={formData.collegeName}
                      onValueChange={(value) => setFormData({ ...formData, collegeName: value })}
                    >
                      <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Parul University', 'GTU', 'LJ University', 'Other'].map((college) => (
                          <SelectItem key={college} value={college}>{college}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  <h2 className="text-base sm:text-lg font-semibold">Skills & Interests</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-foreground">
                    Your Skills and Interests
                  </label>
                  <Input
                    placeholder="e.g., Java, Python, Web Development, AI/ML"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="h-10 sm:h-12 text-sm sm:text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple skills with commas
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="text-xs sm:text-sm font-medium text-foreground flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Self-Assessment Rating
                  </label>
                  <div className="bg-accent/5 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Rate your overall skill level</span>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-xl sm:text-2xl font-bold text-accent">{formData.selfRating[0]}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">/ 10</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className="text-xs sm:text-sm text-muted-foreground min-w-[50px] sm:min-w-[60px]">Beginner</span>
                      <Slider
                        value={formData.selfRating}
                        onValueChange={(value) => setFormData({ ...formData, selfRating: value })}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs sm:text-sm text-muted-foreground min-w-[50px] sm:min-w-[60px] text-right">Expert</span>
                    </div>
                    {/* Hide number labels on mobile to save space */}
                    <div className="hidden sm:flex justify-between text-xs text-muted-foreground pt-2">
                      <span>0</span>
                      <span>2</span>
                      <span>4</span>
                      <span>6</span>
                      <span>8</span>
                      <span>10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button - Stack on mobile, side-by-side on desktop */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-border/30">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate(-1)}
                  className="w-full sm:flex-1 h-11 sm:h-12 text-sm sm:text-base order-2 sm:order-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  variant="accent" 
                  size="lg" 
                  disabled={loading}
                  className="w-full sm:flex-1 h-11 sm:h-12 text-sm sm:text-base order-1 sm:order-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      <span className="text-sm sm:text-base">Submitting...</span>
                    </>
                  ) : (
                    <span className="text-sm sm:text-base">Continue to Skill Assessment</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputDetails;
