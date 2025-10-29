import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePopularSearch = (term: string) => {
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const popularSearches = ['Website Design', 'Logo Design', 'SEO', 'Architecture', 'Social Media'];

  return (
    <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Find the perfect <span className="text-yellow-300">freelance</span> services for your
            business
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Millions of people use GigHub to turn their ideas into reality.
          </p>

          {/* Hero Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try 'building mobile app'"
                className="flex-1 px-6 py-4 text-gray-800 text-lg focus:outline-none"
              />
              <Button type="submit" size="lg" className="px-8 py-4 rounded-none">
                <Icon name="Search" size={20} />
              </Button>
            </form>
          </div>

          {/* Popular searches */}
          <div className="mt-6">
            <span className="text-sm opacity-75">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularSearch(term)}
                className="inline-block ml-3 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm hover:bg-opacity-30 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
