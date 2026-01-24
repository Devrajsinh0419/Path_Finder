import { BarChart3, LayoutDashboard, Target, Compass } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Smart Grade Analysis',
    description: 'Automatic marks analysis that evaluates your strengths, weak spots, and improvement areas.',
  },
  {
    icon: LayoutDashboard,
    title: 'Personalized Dashboard',
    description: 'All your progress in one place — performance graphs, semester-wise statistics, and more.',
  },
  {
    icon: Target,
    title: 'Skills & Strength Mapping',
    description: 'Identify your core strengths, soft skills, and hard skills, grouped into easy-to-understand categories.',
  },
  {
    icon: Compass,
    title: 'Roadmap Guidance',
    description: 'Know where to focus your skills to build, and what domains fit you as you progress.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
          Features of <span className="gradient-text">PathFinder</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="feature-card-steong group animate-fade-in-up "
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              
              <h3 className="font-display text-lg font-semibold mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
