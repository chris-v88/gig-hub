import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import GigCard from '../components/search/GigCard';
import SearchHeader from '../components/search/SearchHeader';
import SearchFilters from '../components/search/SearchFilters';
import EmptyState from '../components/search/EmptyState';
import { gigAPI, type GigSearchResponse } from '../api/gig';

const SearchPage = () => {
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

  if (!query && !category) {
    return <EmptyState type="no-search" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchHeader category={category} query={query} total={total} isLoading={isLoading} />

        <SearchFilters sortBy={sortBy} onSortChange={setSortBy} />

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <EmptyState type="error" error={error} />
        ) : gigs.length === 0 ? (
          <EmptyState type="no-results" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
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
