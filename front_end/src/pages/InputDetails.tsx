import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, Sparkles } from 'lucide-react';
import Stars from '@/components/Stars';
import heroBg from '@/assets/hero-bg.jpg';

const InputDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    enrollmentNo: '',
    semester: '',
    year: '',
    branch: '',
    skills: '',
    selfRating: [0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    navigate('/dashboard');
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      <div className="absolute inset-0 bg-background/60" />
      <Stars />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-glass/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="font-display text-xl font-bold tracking-wider text-accent">
                PATHFINDER
              </span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="glass-card-strong p-8">
            <h1 className="font-display text-2xl font-bold mb-8">Input Details</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-accent text-sm font-medium mb-2 block">
                    First Name
                  </label>
                  <Input
                    placeholder="ex:Dev"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="bg-foreground text-background placeholder:text-background/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-accent text-sm font-medium mb-2 block">
                    Last Name
                  </label>
                  <Input
                    placeholder="ex:Singh"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="bg-foreground text-background placeholder:text-background/50"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Enrollment, Semester, Year */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="text-accent text-sm font-medium mb-2 block">
                    Enrolment No.
                  </label>
                  <Input
                    placeholder="ex:2303396160001"
                    value={formData.enrollmentNo}
                    onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
                    className="bg-foreground text-background placeholder:text-background/50"
                    required
                  />
                </div>
                <div>
                  <label className="text-accent text-sm font-medium mb-2 block">
                    Semester
                  </label>
                  <Select
                    value={formData.semester}
                    onValueChange={(value) => setFormData({ ...formData, semester: value })}
                  >
                    <SelectTrigger className="bg-foreground text-background border-none h-12">
                      <SelectValue placeholder="1st" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {['1st', '2nd', '3rd', '4th', '5th', '6th'].map((sem) => (
                        <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-accent text-sm font-medium mb-2 block">
                    Year
                  </label>
                  <Select
                    value={formData.year}
                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                  >
                    <SelectTrigger className="bg-foreground text-background border-none h-12">
                      <SelectValue placeholder="1st" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {['1st', '2nd', '3rd'].map((year) => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Branch */}
              <div>
                <label className="text-accent text-sm font-medium mb-2 block">
                  Branch
                </label>
                <Input
                  placeholder="ex:Diploma"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  className="bg-foreground text-background placeholder:text-background/50 max-w-md"
                  required
                />
              </div>

              {/* Row 4: Skills */}
              <div>
                <label className="text-accent text-sm font-medium mb-2 block">
                  Skills and interest
                </label>
                <Input
                  placeholder="ex:Java,Python"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="bg-foreground text-background placeholder:text-background/50 max-w-md"
                />
              </div>

              {/* Row 5: Self Rating */}
              <div>
                <label className="text-accent text-sm font-medium mb-4 block">
                  Self Rating for Skills
                </label>
                <div className="flex items-center gap-4 max-w-md">
                  <span className="text-muted-foreground text-sm">0</span>
                  <Slider
                    value={formData.selfRating}
                    onValueChange={(value) => setFormData({ ...formData, selfRating: value })}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground text-sm">10</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit" variant="accent" size="lg">
                  Enter Marks
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
