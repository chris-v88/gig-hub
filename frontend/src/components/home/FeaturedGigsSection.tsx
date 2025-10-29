import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import FeaturedGigCard from './FeaturedGigCard';
import Spinner from '../ui/Spinner';
import { gigAPI } from '../../api/gig';
import type { GigSearchResponse } from '../../api/gig';

const FeaturedGigsSection = () => {
  // Fetch featured gigs for the homepage
  const {
    data: gigsResponse,
    isLoading,
    error,
  } = useQuery<GigSearchResponse>({
    queryKey: ['featuredGigs'],
    queryFn: () => gigAPI.search({ sortBy: 'rating', limit: 8 }),
  });

  const featuredGigs = gigsResponse?.data?.gigs || [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured services</h2>
            <p className="text-lg text-gray-600">Hand-picked by our team</p>
          </div>
          <Link to="/search">
            <Button variant="outline" size="lg">
              View All Services
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Failed to load featured services</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredGigs.map((gig, index) => (
              <FeaturedGigCard key={gig.id} gig={gig} variant={index === 0 ? 'large' : 'default'} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedGigsSection;
