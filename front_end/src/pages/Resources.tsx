import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  ExternalLink,
  Search,
  BookOpen,
  Code,
  Shield,
  Brain,
  Database,
  Cpu,
  Smartphone,
  Cloud,
  Blocks,
  Gamepad2
} from 'lucide-react';

interface Course {
  title: string;
  instructor: string;
  rating: number;
  students: string;
  url: string;
  level: string;
}

interface CourseCategory {
  name: string;
  icon: any;
  color: string;
  courses: Course[];
}

export function Resources() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: CourseCategory[] = [
    {
      name: 'Web Development',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      courses: [
        {
          title: 'The Complete Web Developer Course',
          instructor: 'Rob Percival',
          rating: 4.5,
          students: '300K+',
          url: 'https://www.udemy.com/course/web-design-secrets/',
          level: 'Beginner'
        },
        {
          title: 'Modern React with Redux',
          instructor: 'Stephen Grider',
          rating: 4.6,
          students: '250K+',
          url: 'https://www.udemy.com/course/react-redux/',
          level: 'Intermediate'
        },
        {
          title: 'The Web Developer Bootcamp',
          instructor: 'Colt Steele',
          rating: 4.7,
          students: '400K+',
          url: 'https://www.udemy.com/course/the-web-developer-bootcamp/',
          level: 'Beginner'
        },
      ]
    },
    {
      name: 'AI/ML',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      courses: [
        {
          title: 'Machine Learning A-Z',
          instructor: 'Kirill Eremenko',
          rating: 4.5,
          students: '500K+',
          url: 'https://www.udemy.com/course/machinelearning/',
          level: 'Beginner'
        },
        {
          title: 'Deep Learning Specialization',
          instructor: 'Andrew Ng',
          rating: 4.8,
          students: '300K+',
          url: 'https://www.udemy.com/course/deep-learning-tensorflow-2/',
          level: 'Advanced'
        },
        {
          title: 'Python for Data Science and ML',
          instructor: 'Jose Portilla',
          rating: 4.6,
          students: '400K+',
          url: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/',
          level: 'Intermediate'
        },
      ]
    },
    {
      name: 'Cybersecurity',
      icon: Shield,
      color: 'from-red-500 to-orange-500',
      courses: [
        {
          title: 'Complete Ethical Hacking',
          instructor: 'Zaid Sabih',
          rating: 4.6,
          students: '200K+',
          url: 'https://www.udemy.com/course/learn-ethical-hacking-from-scratch/',
          level: 'Beginner'
        },
        {
          title: 'CompTIA Security+ Certification',
          instructor: 'Jason Dion',
          rating: 4.7,
          students: '150K+',
          url: 'https://www.udemy.com/course/securityplus/',
          level: 'Intermediate'
        },
        {
          title: 'Network Security & Penetration Testing',
          instructor: 'Ermin Kreponic',
          rating: 4.5,
          students: '100K+',
          url: 'https://www.udemy.com/course/network-security-course/',
          level: 'Advanced'
        },
      ]
    },
    {
      name: 'Data Science',
      icon: Database,
      color: 'from-yellow-500 to-amber-500',
      courses: [
        {
          title: 'Data Science Course 2024',
          instructor: '365 Careers',
          rating: 4.6,
          students: '250K+',
          url: 'https://www.udemy.com/course/the-data-science-course-complete-data-science-bootcamp/',
          level: 'Beginner'
        },
        {
          title: 'Python for Data Analysis',
          instructor: 'Jose Portilla',
          rating: 4.7,
          students: '300K+',
          url: 'https://www.udemy.com/course/learning-python-for-data-analysis-and-visualization/',
          level: 'Intermediate'
        },
      ]
    },
    {
      name: 'Mobile Development',
      icon: Smartphone,
      color: 'from-teal-500 to-green-500',
      courses: [
        {
          title: 'Flutter & Dart - Complete Guide',
          instructor: 'Maximilian Schwarzmüller',
          rating: 4.6,
          students: '180K+',
          url: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/',
          level: 'Beginner'
        },
        {
          title: 'iOS & Swift - Complete Course',
          instructor: 'Angela Yu',
          rating: 4.8,
          students: '200K+',
          url: 'https://www.udemy.com/course/ios-13-app-development-bootcamp/',
          level: 'Beginner'
        },
      ]
    },
    {
      name: 'DevOps',
      icon: Cloud,
      color: 'from-indigo-500 to-blue-500',
      courses: [
        {
          title: 'Docker & Kubernetes',
          instructor: 'Stephen Grider',
          rating: 4.6,
          students: '150K+',
          url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
          level: 'Intermediate'
        },
        {
          title: 'AWS Certified Solutions Architect',
          instructor: 'Stephane Maarek',
          rating: 4.7,
          students: '300K+',
          url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/',
          level: 'Intermediate'
        },
      ]
    },
    {
      name: 'Backend Development',
      icon: Cpu,
      color: 'from-green-500 to-emerald-500',
      courses: [
        {
          title: 'Node.js - The Complete Guide',
          instructor: 'Maximilian Schwarzmüller',
          rating: 4.6,
          students: '200K+',
          url: 'https://www.udemy.com/course/nodejs-the-complete-guide/',
          level: 'Intermediate'
        },
        {
          title: 'Python Django - Complete Course',
          instructor: 'Jose Portilla',
          rating: 4.5,
          students: '180K+',
          url: 'https://www.udemy.com/course/python-and-django-full-stack-web-developer-bootcamp/',
          level: 'Beginner'
        },
      ]
    },
    {
      name: 'Blockchain',
      icon: Blocks,
      color: 'from-violet-500 to-purple-500',
      courses: [
        {
          title: 'Blockchain A-Z',
          instructor: 'Hadelin de Ponteves',
          rating: 4.5,
          students: '120K+',
          url: 'https://www.udemy.com/course/build-your-blockchain-az/',
          level: 'Beginner'
        },
        {
          title: 'Ethereum & Solidity',
          instructor: 'Stephen Grider',
          rating: 4.6,
          students: '100K+',
          url: 'https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/',
          level: 'Intermediate'
        },
      ]
    },
  ];

  const filteredCategories = categories.filter(category =>
    selectedCategory ? category.name === selectedCategory : true
  ).filter(category =>
    searchQuery 
      ? category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.courses.some(course => 
          course.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true
  );

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
          
          <h1 className="text-4xl font-bold mb-2">Learning Resources</h1>
          <p className="text-muted-foreground">
            Curated courses to help you master your chosen domain
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search courses or domains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            size="sm"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.name}
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.name)}
              size="sm"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="space-y-12">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            
            return (
              <div key={category.name}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {category.courses.length} courses available
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.courses.map((course, index) => (
                    <div
                      key={index}
                      className="glass-card-strong  rounded-2xl p-6 hover:shadow-xl transition-all group cursor-pointer"
                      onClick={() => window.open(course.url, '_blank')}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            by {course.instructor}
                          </p>
                        </div>
                        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {course.students} students
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-3 py-1 rounded-full ${
                          course.level === 'Beginner' 
                            ? 'bg-green-100 text-green-700' 
                            : course.level === 'Intermediate'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {course.level}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group-hover:bg-accent group-hover:text-white transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(course.url, '_blank');
                          }}
                        >
                          <BookOpen className="w-4 h-4 mr-1" />
                          View Course
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse all categories
            </p>
          </div>
        )}
      </div>
    </div>
  );
}