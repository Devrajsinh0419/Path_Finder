import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { ArrowLeft, Save, Plus, Trash2, Upload } from 'lucide-react';

interface SubjectMark {
  subject: string;
  marks: string;
  grade: string;
}

const SEMESTER_SUBJECTS = {
  1: [
    'Environmental Science',
    'Programming in C - I',
    'Programming in C Lab - I',
    'Basics of Web Development',
    'Basics of Web Development - Lab',
    'Fundamentals of Electrical and Electronics Engineering',
    'Fundamentals of Electrical and Electronics Engineering Lab',
    'Mathematics - I',
    'Communication Skills - I',
  ],
  2: [
    'Programming in C - II',
    'Programing in C Lab - II',
    'Python Programming',
    'Python Programming Lab',
    'Computer Workshop Lab',
    'Mathematics-II',
    'Basic Physics Lab',
    'Basic Physics',
    'Communication Skills - II',
  ],
  3: [
    'Entrepreneurship and Start-ups',
    'Data Structures',
    'Data Structures Lab',
    'Operating Systems',
    'Operating Systems Lab',
    'Introduction to DBMS',
    'Introduction to DBMS Lab',
    'Object Oriented Programming with C++',
    'Object Oriented Programming with C++ Lab',
    'Computer Organization & Architecture',
    'Professional Communication and Critical Thinking',
  ],
  4: [
    'Essence of Indian Knowledge and Tradition',
    'Computer Networks',
    'Computer Networks Lab',
    'Software Engineering',
    'Java Programming',
    'Java Programming Lab',
    'Algorithms',
    'Minor Project',
    'Web Development Using PHP',
    'Web Development Using PHP - Lab',
    'Employability Skills',
  ],
  5: [
    'Information Security',
    'Information Security Lab',
    'Summer Internship',
    'Major Project - I',
    '.Net Programming with C#',
    '.Net Programming with C# Lab',
    'Internet of Things (IoT)',
    'Internet of Things (IoT) Lab',
    'Data Mining',
    'Data Mining Lab',
  ],
  6: [
    'Indian Constitution',
    'Digital Marketing',
    'Digital Marketing Lab',
    'Mobile Application Development',
    'Mobile Application Development Lab',
    'Advance Database Management',
    'Advance Database Management Lab',
    'Artificial Intelligence and Machine Learning',
    'Artificial Intelligence and Machine Learning Lab',
  ],
};

const getGradeFromMarks = (marks: number): string => {
  if (marks >= 90) return 'O';
  if (marks >= 80) return 'A+';
  if (marks >= 70) return 'A';
  if (marks >= 60) return 'B+';
  if (marks >= 50) return 'B';
  if (marks >= 40) return 'P';
  return 'F';
};

export function ManualMarksEntry() {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [subjectMarks, setSubjectMarks] = useState<SubjectMark[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSemesterChange = (semester: string) => {
    const sem = parseInt(semester);
    setSelectedSemester(sem);
    
    // Initialize all subjects for the semester
    const subjects = SEMESTER_SUBJECTS[sem as keyof typeof SEMESTER_SUBJECTS];
    setSubjectMarks(subjects.map(subject => ({
      subject,
      marks: '',
      grade: ''
    })));
  };

  const handleMarksChange = (index: number, marks: string) => {
    const newSubjectMarks = [...subjectMarks];
    const marksNum = parseInt(marks) || 0;
    
    // Validate marks (0-100)
    if (marks !== '' && (marksNum < 0 || marksNum > 100)) {
      toast({
        title: 'Invalid Marks',
        description: 'Marks must be between 0 and 100',
        variant: 'destructive',
      });
      return;
    }
    
    newSubjectMarks[index].marks = marks;
    newSubjectMarks[index].grade = marks ? getGradeFromMarks(marksNum) : '';
    setSubjectMarks(newSubjectMarks);
  };

  const handleSubmit = async () => {
    // Validate that at least one subject has marks
    const hasMarks = subjectMarks.some(sm => sm.marks !== '');
    
    if (!hasMarks) {
      toast({
        title: 'No Marks Entered',
        description: 'Please enter marks for at least one subject',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Filter out subjects without marks
      const validSubjects = subjectMarks.filter(sm => sm.marks !== '');
      
      // Send to backend
      const response = await api.post('/academics/manual-marks/', {
        semester: selectedSemester,
        subjects: validSubjects.map(sm => ({
          subject: sm.subject,
          marks: parseInt(sm.marks),
          grade: sm.grade
        }))
      });

      toast({
        title: 'Success!',
        description: `Marks for Semester ${selectedSemester} saved successfully`,
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving marks:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to save marks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSGPA = () => {
    const validMarks = subjectMarks.filter(sm => sm.marks !== '');
    if (validMarks.length === 0) return 0;
    
    const totalMarks = validMarks.reduce((sum, sm) => sum + parseInt(sm.marks), 0);
    const avgMarks = totalMarks / validMarks.length;
    return ((avgMarks / 100) * 10).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/upload-results')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">Manual Marks Entry</h1>
          <p className="text-muted-foreground">
            Enter your marks manually for each subject
          </p>
        </div>

        {/* Semester Selection */}
        <div className="glass-card-strong p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Semester
              </label>
              <Select onValueChange={handleSemesterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose semester" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {subjectMarks.length > 0 && (
              <div className="flex items-end">
                <div className="glass-card p-4 w-full">
                  <p className="text-sm text-muted-foreground mb-1">Estimated SGPA</p>
                  <p className="text-3xl font-bold text-accent">{calculateSGPA()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Subjects Table */}
        {subjectMarks.length > 0 && (
          <div className="glass-card-strong p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                Semester {selectedSemester} Subjects
              </h2>
              <div className="text-sm text-muted-foreground">
                {subjectMarks.filter(sm => sm.marks !== '').length} of {subjectMarks.length} subjects filled
              </div>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {subjectMarks.map((sm, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                >
                  <div className="md:col-span-6 flex items-center">
                    <span className="font-medium">{sm.subject}</span>
                  </div>
                  
                  <div className="md:col-span-3">
                    <Input
                      type="number"
                      placeholder="Enter marks (0-100)"
                      value={sm.marks}
                      onChange={(e) => handleMarksChange(index, e.target.value)}
                      min="0"
                      max="100"
                      className="w-full"
                    />
                  </div>

                  <div className="md:col-span-3 flex items-center justify-center">
                    {sm.grade && (
                      <div className={`px-4 py-2 rounded-lg font-bold text-white ${
                        sm.grade === 'O' ? 'bg-green-600' :
                        sm.grade === 'A+' ? 'bg-green-500' :
                        sm.grade === 'A' ? 'bg-blue-500' :
                        sm.grade === 'B+' ? 'bg-blue-400' :
                        sm.grade === 'B' ? 'bg-yellow-500' :
                        sm.grade === 'P' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}>
                        Grade: {sm.grade}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Grade Legend */}
            <div className="mt-6 p-4 bg-accent/5 rounded-lg">
              <p className="text-sm font-medium mb-2">Grade Scale:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><span className="font-semibold">O:</span> 90-100</div>
                <div><span className="font-semibold">A+:</span> 80-89</div>
                <div><span className="font-semibold">A:</span> 70-79</div>
                <div><span className="font-semibold">B+:</span> 60-69</div>
                <div><span className="font-semibold">B:</span> 50-59</div>
                <div><span className="font-semibold">P:</span> 40-49</div>
                <div><span className="font-semibold">F:</span> Below 40</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {subjectMarks.length > 0 && (
          <div className="flex gap-4">
            <Button
              onClick={() => navigate('/upload-results')}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !subjectMarks.some(sm => sm.marks !== '')}
              variant="accent"
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Marks
                </>
              )}
            </Button>
          </div>
        )}

        {subjectMarks.length === 0 && (
          <div className="text-center py-12 glass-card-strong">
            <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select a Semester</h3>
            <p className="text-muted-foreground">
              Choose a semester from the dropdown above to start entering marks
            </p>
          </div>
        )}
      </div>
    </div>
  );
}