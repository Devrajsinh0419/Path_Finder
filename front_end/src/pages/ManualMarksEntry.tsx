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
import { ArrowLeft, Save, CheckCircle, Circle } from 'lucide-react';

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
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <Button
            onClick={() => navigate('/upload-results')}
            variant="ghost"
            className="mb-3 sm:mb-4 h-9 sm:h-10 text-sm sm:text-base"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2" />
            Back
          </Button>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Manual Grade Entry</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Select grades for each subject. You can fill multiple semesters before saving.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Mobile Semester Selector - Show on mobile only */}
          <div className="lg:hidden">
            <Select value={selectedSemester.toString()} onValueChange={handleSemesterChange}>
              <SelectTrigger className="w-full h-11 sm:h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((sem) => {
                  const progress = getSemesterProgress(sem);
                  return (
                    <SelectItem key={sem} value={sem.toString()}>
                      <div className="flex items-center gap-2">
                        <span>Semester {sem}</span>
                        {progress.filled > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ({progress.filled}/{progress.total})
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1">
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

          {/* Main Content - Mobile Optimized */}
          <div className="lg:col-span-3">
            <div className="glass-card-strong p-4 sm:p-6 mb-4 sm:mb-6 rounded-xl sm:rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Semester {selectedSemester} Subjects
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    {currentSemesterData.filter(sg => sg.grade !== '').length} of {currentSemesterData.length} subjects filled
                  </p>
                </div>
                <div className="glass-card p-3 sm:p-4 self-start sm:self-auto">
                  <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">SGPA</p>
                  <p className="text-xl sm:text-2xl font-bold text-accent">
                    {calculateSGPA(currentSemesterData)}
                  </p>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] sm:max-h-[700px] overflow-y-auto pr-1 sm:pr-2">
                {currentSemesterData.map((sg, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 gap-3 p-3 sm:p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-xs sm:text-sm">{sg.subject}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Select
                        value={sg.grade}
                        onValueChange={(grade) => handleGradeChange(index, grade)}
                      >
                        <SelectTrigger className="w-full h-10 sm:h-11 text-xs sm:text-sm">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {GRADES.map((grade) => (
                            <SelectItem key={grade.value} value={grade.value} className="text-xs sm:text-sm">
                              {grade.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {sg.grade && (
                        <div className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-white text-center text-xs sm:text-sm ${getGradeColor(sg.grade)}`}>
                          {sg.grade} ({sg.marks} marks)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Grade Legend - Mobile Optimized */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-accent/5 rounded-lg">
                <p className="text-xs sm:text-sm font-medium mb-3">Grade Scale Reference:</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                  {GRADES.map((grade) => (
                    <div key={grade.value} className="flex items-center gap-1.5 sm:gap-2">
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center text-white font-bold text-xs sm:text-sm ${grade.color} flex-shrink-0`}>
                        {grade.value}
                      </div>
                      <div className="text-[10px] sm:text-xs min-w-0">
                        <div className="font-semibold">{grade.value}</div>
                        <div className="text-muted-foreground">{grade.marks}m</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Save Button - Fixed at bottom */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-background/95 backdrop-blur-md border-t border-border/10">
              <Button
                onClick={handleSubmit}
                disabled={loading || Object.values(allSemesterData).every(semData => 
                  !semData.some(sg => sg.grade !== '')
                )}
                variant="accent"
                className="w-full h-12 sm:h-14 text-sm sm:text-base"
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
        </div>
      </div>
      
      {/* Add padding at bottom on mobile to prevent content from being hidden by fixed button */}
      <div className="lg:hidden h-20 sm:h-24" />
    </div>
  );
}