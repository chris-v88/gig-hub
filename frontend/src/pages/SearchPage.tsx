import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Icon from '../components/ui/Icon';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { gigAPI, type GigSearchResponse } from '../api/gig';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const [sortBy, setSortBy] = useState('relevance');

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery<GigSearchResponse>({
    queryKey: ['searchGigs', query, category, sortBy],
    queryFn: () => gigAPI.search({ query, category, sortBy }),
    enabled: !!(query || category),
  });

  const gigs = searchResults?.data?.gigs || [];
  const total = searchResults?.data?.total || 0;

  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="Star" size={12} className="text-yellow-400 fill-current" />);
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="StarHalf" size={12} className="text-yellow-400 fill-current" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Icon key={`empty-${i}`} name="Star" size={12} className="text-gray-300" />);
    }

    return stars;
  };

  if (!query && !category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Search for Services</h2>
          <p className="text-gray-600">Use the search bar above to find amazing services</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {category ? `${category} Services` : `Results for "${query}"`}
          </h1>
          <p className="text-gray-600">
            {isLoading ? 'Searching...' : `${total} services available`}
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="relevance">Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Best Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Icon name="AlertCircle" size={48} className="text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600">Please try again later</p>
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or browse our categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map((gig: GigSearchResponse['data']['gigs'][0]) => (
              <div
                key={gig.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Gig Image */}
                <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                  {gig.images && gig.images.length > 0 ? (
                    <img
                      src={gig.images[0]}
                      alt={gig.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon name="Image" size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {/* Seller Info */}
                  <div className="flex items-center mb-3">
                    {gig.user.profile_image ? (
                      <img
                        src={gig.user.profile_image}
                        alt={gig.user.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <Icon name="User" size={12} className="text-green-600" />
                      </div>
                    )}
                    <span className="text-sm text-gray-600">{gig.user.name}</span>
                  </div>

                  {/* Gig Title */}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{gig.title}</h3>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-2">{renderStars(gig.rating ?? 0)}</div>
                    <span className="text-sm text-gray-600">(New)</span>
                  </div>

                  {/* Price and Delivery */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-lg font-bold text-gray-900">${gig.starting_price}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <Icon name="Clock" size={12} className="inline mr-1" />
                      {gig.delivery_time} days
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if needed) */}
        {gigs.length > 0 && gigs.length < total && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
