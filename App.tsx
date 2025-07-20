import React from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { AgencyServicesSection } from './components/AgencyServicesSection';
import { ProductsSection } from './components/ProductsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main>
        <HeroSection />
        <WhyChooseUsSection />
        <AgencyServicesSection />
        <ProductsSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
