import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const CallToActionSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join millions of entrepreneurs who&apos;ve used GigHub to bring their ideas to life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" tone="secondary" className="px-8">
              Join GigHub
            </Button>
          </Link>
          <Link to="/search">
            <Button
              size="lg"
              variant="outline"
              className="px-8 border-white text-white hover:bg-white hover:text-blue-600"
            >
              Browse Services
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;
