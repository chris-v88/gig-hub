import React from 'react';
import HeroSection from '../components/home/HeroSection';
import PopularCategoriesSection from '../components/home/PopularCategoriesSection';
import FeaturedGigsSection from '../components/home/FeaturedGigsSection';
import CallToActionSection from '../components/home/CallToActionSection';
import StatsSection from '../components/home/StatsSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <PopularCategoriesSection />
      <FeaturedGigsSection />
      <CallToActionSection />
      <StatsSection />
    </div>
  );
};

export default HomePage;
