import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Stars from '@/components/Stars';
import {
  Target,
  Users,
  Lightbulb,
  TrendingUp,
  BookOpen,
  Sparkles,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  BarChart3,
  Map
} from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Performance Analysis',
      description: 'Upload your academic results and get instant insights into your strengths and areas for improvement.'
    },
    {
      icon: Target,
      title: 'AI-Powered Recommendations',
      description: 'Our machine learning algorithms analyze your performance to suggest the best career paths tailored for you.'
    },
    {
      icon: Map,
      title: 'Personalized Roadmaps',
      description: 'Get step-by-step learning paths from roadmap.sh customized to your chosen domain and skill level.'
    },
    {
      icon: BookOpen,
      title: 'Curated Resources',
      description: 'Access hand-picked courses, tutorials, and resources from top platforms like Udemy to accelerate your learning.'
    },
  ];

  const stats = [
    { number: '10+', label: 'Career Domains' },
    { number: '100+', label: 'Curated Courses' },
    { number: 'AI', label: 'Powered Analysis' },
    { number: '24/7', label: 'Access' },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI and ML technologies to provide the most accurate career recommendations.'
    },
    {
      icon: Users,
      title: 'Student-Centric',
      description: 'Every feature is designed with students in mind, making career planning accessible and personalized.'
    },
    {
      icon: TrendingUp,
      title: 'Growth-Focused',
      description: 'We help you identify opportunities for growth and provide resources to help you achieve your goals.'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <Stars />
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">About PathFinder</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Empowering Students to
              <span className="gradient-text block mt-2">Find Their Path</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              PathFinder is an AI-powered platform that analyzes your academic performance 
              and guides you toward the perfect career path with personalized recommendations 
              and curated learning resources.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card-strong p-6 text-center">
                <div className="text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-6">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Making Career Decisions 
                <span className="gradient-text block mt-2">Simple & Data-Driven</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6">
                We believe that every student deserves clarity when choosing their career path. 
                That's why we built PathFinder - to transform academic data into actionable insights 
                and personalized guidance.
              </p>
              <p className="text-muted-foreground text-lg">
                By combining machine learning with curated educational resources, we help students 
                discover their strengths, explore career options, and create a roadmap for success.
              </p>
            </div>
            <div className="relative">
              <div className="glass-card-strong p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">For Students</h3>
                    <p className="text-sm text-muted-foreground">
                      Get personalized career guidance based on your actual academic performance
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Data-Driven Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      AI analyzes your grades to identify your strongest domains
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Map className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Clear Roadmaps</h3>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step learning paths tailored to your chosen career
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How PathFinder Works</h2>
            <p className="text-xl text-muted-foreground">
              A simple, powerful process to discover your ideal career path
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="glass-card-strong p-8 hover:shadow-xl transition-all">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-accent/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                Why Choose 
                <span className="gradient-text block mt-2">PathFinder?</span>
              </h2>
              <div className="space-y-4">
                {[
                  'AI-powered analysis of your academic performance',
                  'Personalized career recommendations based on your strengths',
                  'Access to curated learning resources and roadmaps',
                  'Track your progress across multiple semesters',
                  'Discover career domains you never considered',
                  'Free to use with no hidden costs'
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                    <p className="text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card-strong p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of students who have discovered their ideal career path 
                with PathFinder. Upload your results and get personalized recommendations 
                in minutes.
              </p>
              <Link to="/signup">
                <Button variant="accent" size="lg" className="w-full">
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-accent/10 to-accent/5 relative overflow-hidden">
        <Stars />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Future Starts Here
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Don't let uncertainty hold you back. Discover your strengths, 
            explore career options, and build your future with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="accent" size="lg">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;