import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhatsSection from '@/components/WhatIsSection';
import FeaturesSection from '@/components/FeaturesSection';
import InfoSection from '@/components/InfoSection';
import Footer from '@/components/Footer';
import Stars from '@/components/Stars';

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Stars />
      <Navbar />
      <HeroSection />
      <section id="how-it-works">
        <WhatsSection />
      </section>
      <section id="features">
        <FeaturesSection />
      </section>
      <section id="about">
        <InfoSection />
      </section>
      <Footer />
    </div>
  );
};

export default Index;
