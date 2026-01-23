import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import api from '@/lib/api';
import { ArrowLeft, Save, Upload, CheckCircle, Circle } from 'lucide-react';

interface SubjectGrade {
  subject: string;
  grade: string;
  marks: number;
}

interface SemesterData {
  [semester: number]: SubjectGrade[];
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

const GRADES = [
  { value: 'O', label: 'O - Outstanding (90-100)', marks: 95, color: 'bg-green-600' },
  { value: 'A+', label: 'A+ - Excellent (80-89)', marks: 85, color: 'bg-green-500' },
  { value: 'A', label: 'A - Very Good (70-79)', marks: 75, color: 'bg-blue-500' },
  { value: 'B+', label: 'B+ - Good (60-69)', marks: 65, color: 'bg-blue-400' },
  { value: 'B', label: 'B - Above Average (50-59)', marks: 55, color: 'bg-yellow-500' },
  { value: 'P', label: 'P - Pass (40-49)', marks: 45, color: 'bg-orange-500' },
  { value: 'F', label: 'F - Fail (<40)', marks: 30, color: 'bg-red-500' },
];

const getMarksFromGrade = (grade: string): number => {
  const gradeObj = GRADES.find(g => g.value === grade);
  return gradeObj?.marks || 0;
};

const getGradeColor = (grade: string): string => {
  const gradeObj = GRADES.find(g => g.value === grade);
  return gradeObj?.color || 'bg-gray-500';
};

export function ManualMarksEntry() {
  const navigate = useNavigate();
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [allSemesterData, setAllSemesterData] = useState<SemesterData>({});
  const [loading, setLoading] = useState(false);

  const initializeSemester = (sem: number) => {
    if (!allSemesterData[sem]) {
      const subjects = SEMESTER_SUBJECTS[sem as keyof typeof SEMESTER_SUBJECTS];
      return subjects.map(subject => ({
        subject,
        grade: '',
        marks: 0
      }));
    }
    return allSemesterData[sem];
  };

  const getCurrentSemesterData = () => {
    return initializeSemester(selectedSemester);
  };

  const handleSemesterChange = (semester: string) => {
    const sem = parseInt(semester);
    
    // If switching to a new semester that hasn't been initialized, initialize it
    if (!allSemesterData[sem]) {
      const subjects = SEMESTER_SUBJECTS[sem as keyof typeof SEMESTER_SUBJECTS];
      setAllSemesterData({
        ...allSemesterData,
        [sem]: subjects.map(subject => ({
          subject,
          grade: '',
          marks: 0
        }))
      });
    }
    
    setSelectedSemester(sem);
  };

  const handleGradeChange = (index: number, grade: string) => {
    const currentData = getCurrentSemesterData();
    const newData = [...currentData];
    newData[index].grade = grade;
    newData[index].marks = getMarksFromGrade(grade);
    
    setAllSemesterData({
      ...allSemesterData,
      [selectedSemester]: newData
    });
  };

  const handleSubmit = async () => {
    // Check if any semester has grades
    const hasAnyGrades = Object.values(allSemesterData).some(semData => 
      semData.some(sg => sg.grade !== '')
    );
    
    if (!hasAnyGrades) {
      toast({
        title: 'No Grades Selected',
        description: 'Please select grades for at least one subject',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Submit all semesters with data
      const semestersToSubmit = Object.entries(allSemesterData).filter(([_, semData]) => 
        semData.some(sg => sg.grade !== '')
      );

      for (const [semester, semData] of semestersToSubmit) {
        const validSubjects = semData.filter(sg => sg.grade !== '');
        
        if (validSubjects.length > 0) {
          await api.post('/academics/manual-marks/', {
            semester: parseInt(semester),
            subjects: validSubjects.map(sg => ({
              subject: sg.subject,
              marks: sg.marks,
              grade: sg.grade
            }))
          });
        }
      }

      toast({
        title: 'Success!',
        description: `Grades for ${semestersToSubmit.length} semester(s) saved successfully`,
      });

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error saving grades:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to save grades',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateSGPA = (semData: SubjectGrade[]) => {
    const validGrades = semData.filter(sg => sg.grade !== '');
    if (validGrades.length === 0) return 0;
    
    const totalMarks = validGrades.reduce((sum, sg) => sum + sg.marks, 0);
    const avgMarks = totalMarks / validGrades.length;
    return ((avgMarks / 100) * 10).toFixed(2);
  };

  const getSemesterProgress = (sem: number) => {
    const semData = allSemesterData[sem];
    if (!semData) return { filled: 0, total: 0, percentage: 0 };
    
    const filled = semData.filter(sg => sg.grade !== '').length;
    const total = semData.length;
    const percentage = (filled / total) * 100;
    
    return { filled, total, percentage };
  };

  const currentSemesterData = getCurrentSemesterData();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
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
          
          <h1 className="text-4xl font-bold mb-2">Manual Grade Entry</h1>
          <p className="text-muted-foreground">
            Select grades for each subject. You can fill multiple semesters before saving.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Semester Progress */}
          <div className="lg:col-span-1">
            <div className="glass-card-strong p-6 sticky top-6">
              <h3 className="font-semibold mb-4">Semester Progress</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5, 6].map((sem) => {
                  const progress = getSemesterProgress(sem);
                  const isComplete = progress.filled > 0;
                  
                  return (
                    <button
                      key={sem}
                      onClick={() => handleSemesterChange(sem.toString())}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        selectedSemester === sem
                          ? 'bg-accent text-white'
                          : 'bg-accent/5 hover:bg-accent/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Semester {sem}</span>
                        {isComplete ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="text-xs opacity-80">
                        {progress.filled}/{progress.total} subjects
                      </div>
                      {progress.filled > 0 && (
                        <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-white h-1.5 rounded-full transition-all"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Save Button in Sidebar */}
              <Button
                onClick={handleSubmit}
                disabled={loading || Object.values(allSemesterData).every(semData => 
                  !semData.some(sg => sg.grade !== '')
                )}
                variant="accent"
                className="w-full mt-6"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Grades
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Main Content - Subject List */}
          <div className="lg:col-span-3">
            <div className="glass-card-strong p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    Semester {selectedSemester} Subjects
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentSemesterData.filter(sg => sg.grade !== '').length} of {currentSemesterData.length} subjects filled
                  </p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs text-muted-foreground mb-1">SGPA</p>
                  <p className="text-2xl font-bold text-accent">
                    {calculateSGPA(currentSemesterData)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2">
                {currentSemesterData.map((sg, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  >
                    <div className="md:col-span-1 flex items-center">
                      <span className="font-medium text-sm">{sg.subject}</span>
                    </div>
                    
                    <div className="md:col-span-1">
                      <Select
                        value={sg.grade}
                        onValueChange={(grade) => handleGradeChange(index, grade)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES.map((grade) => (
                            <SelectItem key={grade.value} value={grade.value}>
                              {grade.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-1 flex items-center justify-center">
                      {sg.grade && (
                        <div className={`px-4 py-2 rounded-lg font-bold text-white w-full text-center ${getGradeColor(sg.grade)}`}>
                          {sg.grade} ({sg.marks} marks)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grade Legend */}
              <div className="mt-6 p-4 bg-accent/5 rounded-lg">
                <p className="text-sm font-medium mb-3">Grade Scale Reference:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {GRADES.map((grade) => (
                    <div key={grade.value} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold ${grade.color}`}>
                        {grade.value}
                      </div>
                      <div className="text-xs">
                        <div className="font-semibold">{grade.value}</div>
                        <div className="text-muted-foreground">{grade.marks} marks</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}