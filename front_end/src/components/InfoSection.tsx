const infoCards = [
  {
    label: 'How It Works',
    content: '"Helping diploma students find the right domain through clear academic insights."',
  },
  {
    label: 'Who It Helps',
    content: '"Diploma students from Sem 1 to graduation."',
  },
  {
    label: 'What You Get',
    content: '"A personalized dashboard, AI suggestions, skill map, and roadmap."',
  },
];

const InfoSection = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-transparent via-card/30 to-transparent">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
          All There Is To <span className="gradient-text">Know</span>
        </h2>

        <div className="space-y-4">
          {infoCards.map((card, index) => (
            <div
              key={card.label}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <p className="text-muted-foreground text-sm mb-2">{card.label}</p>
              <div className="info-card hover:border-accent/50 transition-all duration-300 hover:bg-accent/15">
                <p className="text-foreground italic">{card.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
