import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  BookOpen, 
  Target, 
  AlertCircle,
  Upload,
  Star
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AnalysisData {
  has_results: boolean;
  cgpa?: number;
  semester_scores?: Array<{ semester: number; score: number }>;
  subject_performance?: Array<{ subject: string; marks: number; grade: string }>;
  domain_recommendation?: {
    recommended_domain: string;
    top_domains: Array<{ domain: string; score: number }>;
    weak_areas: string[];
    strong_subject: string;
  };
  total_subjects?: number;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchAnalysis();
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const fetchAnalysis = async () => {
    try {
      const response = await api.get('/academics/analysis/');
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analysis data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!analysis?.has_results) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Results Yet</h2>
          <p className="text-muted-foreground mb-6">
            Upload your grade sheet to get personalized career recommendations and track your progress
          </p>
          <Button
            onClick={() => navigate('/upload-results')}
            variant="accent"
            size="lg"
          >
            Upload Grade Sheet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.first_name || 'Student'}!
          </h1>
          <p className="text-muted-foreground">
            Here's your academic performance overview
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* CGPA Card */}
          <div className="glass-card-strong p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">CGPA</h3>
              <Star className="w-5 h-5 text-accent" />
            </div>
            <p className="text-4xl font-bold text-accent">{analysis.cgpa}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {analysis.total_subjects} subjects
            </p>
          </div>

          {/* Recommended Domain */}
          <div className="glass-card-strong p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Best Match</h3>
              <Target className="w-5 h-5 text-accent" />
            </div>
            <p className="text-2xl font-bold text-accent">
              {analysis.domain_recommendation?.recommended_domain}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on your strengths
            </p>
          </div>

          {/* Strong Subject */}
          <div className="glass-card-strong p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Performer</h3>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <p className="text-lg font-semibold">
              {analysis.domain_recommendation?.strong_subject}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Your strongest subject
            </p>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="glass-card-strong p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-accent" />
            Career Domain Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.domain_recommendation?.top_domains.map((domain, index) => (
              <div
                key={index}
                className="bg-accent/10 rounded-lg p-4 border border-accent/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">{domain.domain}</span>
                  <span className="text-sm text-accent">#{index + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background/50 rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min((domain.score / 500) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {domain.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button
            onClick={() => navigate('/roadmap')}
            variant="accent"
            className="mt-4"
          >
            View Learning Roadmap
          </Button>
        </div>

        {/* Semester Progress */}
        <div className="glass-card-strong p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Semester-wise Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {analysis.semester_scores?.map((sem) => (
              <div
                key={sem.semester}
                className="bg-accent/10 rounded-lg p-4 text-center"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  Sem {sem.semester}
                </p>
                <p className="text-2xl font-bold text-accent">{sem.score}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        {analysis.domain_recommendation?.weak_areas.length > 0 && (
          <div className="glass-card-strong p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-500" />
              Areas for Improvement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.domain_recommendation.weak_areas.map((area, index) => (
                <div
                  key={index}
                  className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20"
                >
                  <p className="font-medium">{area}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Focus on improving this subject
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={() => navigate('/upload-results')}
            variant="outline"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload New Results
          </Button>
          <Button
            onClick={() => navigate('/resources')}
            variant="outline"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Resources
          </Button>
        </div>
      </div>
    </div>
  );
}