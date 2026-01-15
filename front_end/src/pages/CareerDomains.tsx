import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  ExternalLink,
  TrendingUp,
  Code,
  Shield,
  Brain,
  Database,
  Cpu,
  Smartphone
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Domain {
  name: string;
  description: string;
  score: number;
  skillLevel: string;
  icon: any;
  color: string;
  roadmapUrl: string;
}

export function CareerDomains() {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRecommendation, setUserRecommendation] = useState<any>(null);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const response = await api.get('/academics/analysis/');
      
      if (response.data.has_results) {
        setUserRecommendation(response.data.domain_recommendation);
        
        // Create domains with user's scores
        const userDomains = createDomainsWithScores(response.data.domain_recommendation);
        setDomains(userDomains);
      } else {
        // Show default domains without scores
        setDomains(getDefaultDomains());
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
      toast({
        title: 'Error',
        description: 'Failed to load domain data',
        variant: 'destructive',
      });
      // Show default domains on error
      setDomains(getDefaultDomains());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultDomains = (): Domain[] => {
    return [
      {
        name: 'Frontend Development',
        description: 'Build beautiful and interactive user interfaces using modern frameworks',
        score: 0,
        skillLevel: 'Not Assessed',
        icon: Code,
        color: 'from-blue-500 to-cyan-500',
        roadmapUrl: 'https://roadmap.sh/frontend'
      },
      {
        name: 'Backend Development',
        description: 'Design and build server-side applications and APIs',
        score: 0,
        skillLevel: 'Not Assessed',
        icon: Database,
        color: 'from-green-500 to-emerald-500',
        roadmapUrl: 'https://roadmap.sh/backend'
      },
      {
        name: 'AI/ML',
        description: 'Build intelligent systems using machine learning and artificial intelligence',
        score: 0,
        skillLevel: 'Not Assessed',
        icon: Brain,
        color: 'from-purple-500 to-pink-500',
        roadmapUrl: 'https://roadmap.sh/ai-data-scientist'
      },
      {
        name: 'Cybersecurity',
        description: 'Protect systems and networks from digital attacks',
        score: 0,
        skillLevel: 'Not Assessed',
        icon: Shield,
        color: 'from-red-500 to-orange-500',
        roadmapUrl: 'https://roadmap.sh/cyber-security'
      },
      {
        name: 'Data Science',
        description: 'Extract insights from data using statistical and computational methods',
        score: 0,
        skillLevel: 'Not Assessed',
        icon: TrendingUp,
        color: 'from-yellow-500 to-amber-500',
        roadmapUrl: 'https://roadmap.sh/data-analyst'
      },
      {
        name: 'DevOps',
        description: 'Automate and streamline software development and deployment',
        score: 0,
        skillLevel: 'Not Assessed',
        icon: Cpu,
        color: 'from-indigo-500 to-blue-500',
        roadmapUrl: 'https://roadmap.sh/devops'
      },
      {
        name: 'Mobile Development',
        description: 'Create native and cross-platform mobile applications',
        score: 0,
        skillLevel: 'Not Assessed',
        icon: Smartphone,
        color: 'from-teal-500 to-green-500',
        roadmapUrl: 'https://roadmap.sh/android'
      },
    ];
  };

  const createDomainsWithScores = (recommendation: any): Domain[] => {
    const defaultDomains = getDefaultDomains();
    const topDomains = recommendation.top_domains || [];
    
    // Map user's top domains to the default domains
    const domainMap = new Map<string, number>();
    topDomains.forEach((d: any) => {
      // Normalize domain names for matching
      const normalizedName = d.domain.toLowerCase();
      domainMap.set(normalizedName, d.score);
    });

    return defaultDomains.map(domain => {
      const normalizedName = domain.name.toLowerCase();
      let score = 0;

      // Check if this domain matches any of the user's top domains
      for (const [key, value] of domainMap.entries()) {
        if (normalizedName.includes(key) || key.includes(normalizedName.split(' ')[0])) {
          score = value;
          break;
        }
      }

      const skillLevel = getSkillLevel(score);

      return {
        ...domain,
        score: Math.round(score),
        skillLevel
      };
    });
  };

  const getSkillLevel = (score: number): string => {
    if (score === 0) return 'Not Assessed';
    if (score < 100) return 'Beginner';
    if (score < 200) return 'Intermediate';
    if (score < 350) return 'Advanced';
    return 'Expert';
  };

  const getSkillPercentage = (score: number): number => {
    // Maximum score is around 500, so convert to percentage
    return Math.min((score / 500) * 100, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading career domains...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-4xl font-bold mb-2">Career Domains</h1>
          <p className="text-muted-foreground">
            Explore different career paths and find your learning roadmap
          </p>

          {userRecommendation && (
            <div className="mt-4 bg-accent/10 border border-accent/20 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Recommended for you</p>
              <p className="text-xl font-bold text-accent">
                {userRecommendation.recommended_domain}
              </p>
            </div>
          )}
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((domain, index) => {
            const Icon = domain.icon;
            const percentage = getSkillPercentage(domain.score);
            const isRecommended = userRecommendation?.recommended_domain === domain.name;

            return (
              <div
                key={index}
                className={`glass-card-strong p-6 hover:scale-105 transition-transform cursor-pointer ${
                  isRecommended ? 'ring-2 ring-accent' : ''
                }`}
                onClick={() => window.open(domain.roadmapUrl, '_blank')}
              >
                {isRecommended && (
                  <div className="text-xs font-semibold text-accent mb-2">
                    ⭐ RECOMMENDED FOR YOU
                  </div>
                )}

                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${domain.color} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>

                <h3 className="text-xl font-bold mb-2">{domain.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {domain.description}
                </p>

                {/* Skill Level */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Skill Level</span>
                    <span className={`text-sm font-semibold ${
                      domain.score > 0 ? 'text-accent' : 'text-muted-foreground'
                    }`}>
                      {domain.skillLevel}
                    </span>
                  </div>
                  
                  <div className="w-full bg-background/50 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all bg-gradient-to-r ${domain.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  
                  {domain.score > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Score: {domain.score}
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(domain.roadmapUrl, '_blank');
                  }}
                >
                  View Roadmap
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 glass-card-strong p-6">
          <h2 className="text-2xl font-bold mb-4">About These Roadmaps</h2>
          <p className="text-muted-foreground mb-4">
            Each domain has a curated learning path from roadmap.sh, a community-driven platform
            that provides step-by-step guides for developers. Click on any domain to explore its
            complete roadmap and start your learning journey.
          </p>
          
          {!userRecommendation && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mt-4">
              <p className="text-sm">
                💡 <strong>Tip:</strong> Upload your grade sheet to get personalized recommendations
                and see which domains match your strengths!
              </p>
              <Button
                onClick={() => navigate('/upload-results')}
                variant="outline"
                className="mt-3"
                size="sm"
              >
                Upload Grade Sheet
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}