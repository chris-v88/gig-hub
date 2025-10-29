import React from 'react';

export type SearchHeaderProps = {
  category?: string;
  query?: string;
  total: number;
  isLoading: boolean;
};

const SearchHeader = (props: SearchHeaderProps) => {
  const { category, query, total, isLoading } = props;

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {category ? `${category} Services` : `Results for "${query}"`}
      </h1>
      <p className="text-gray-600">{isLoading ? 'Searching...' : `${total} services available`}</p>
    </div>
  );
};

export default SearchHeader;
