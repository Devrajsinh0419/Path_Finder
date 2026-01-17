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
import heroBg from '@/assets/hero-bg.jpg';

const InputDetails = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    enrollmentNo: "",
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
      await api.post("/academics/student-profile/", formData)
      toast({
        title: "Profile Submitted",
        description: "Your profile has been successfully submitted.",
      })
      navigate("/upload-results")
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-glass/70 transition-all hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <span className="font-display text-xl font-bold tracking-wider">
                PATHFINDER
              </span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="glass-card-strong p-8 md:p-10">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold mb-2 gradient-text">
                Complete Your Profile
              </h1>
              <p className="text-muted-foreground">
                Help us personalize your learning journey
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <GraduationCap className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      First Name
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="h-12"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      Last Name
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Enrollment Number
                    <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., 2303396160001"
                    value={formData.enrollmentNo}
                    onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                    className="h-12 max-w-md"
                    required
                  />
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <Calendar className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold">Academic Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Current Semester
                    </label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => setFormData({ ...formData, semester: value })}
                    >
                      <SelectTrigger className="h-12">
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
                    <label className="text-sm font-medium text-foreground">
                      Academic Year
                    </label>
                    <Select
                      value={formData.year}
                      onValueChange={(value) => setFormData({ ...formData, year: value })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {['1st', '2nd', '3rd', '4th'].map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Branch/Stream
                      <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="e.g., Computer Engineering"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                      className="h-12"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-border/30">
                  <Code className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-semibold">Skills & Interests</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Your Skills and Interests
                  </label>
                  <Input
                    placeholder="e.g., Java, Python, Web Development, AI/ML"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple skills with commas
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Self-Assessment Rating
                  </label>
                  <div className="bg-accent/5 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Rate your overall skill level</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-accent">{formData.selfRating[0]}</span>
                        <span className="text-sm text-muted-foreground">/ 10</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground min-w-[60px]">Beginner</span>
                      <Slider
                        value={formData.selfRating}
                        onValueChange={(value) => setFormData({ ...formData, selfRating: value })}
                        max={10}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm text-muted-foreground min-w-[60px] text-right">Expert</span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground pt-2">
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

              {/* Submit Button */}
              <div className="flex gap-4 pt-6 border-t border-border/30">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate(-1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  variant="accent" 
                  size="lg" 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Continue to Upload Results'
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