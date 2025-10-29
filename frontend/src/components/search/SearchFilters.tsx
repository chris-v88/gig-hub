import React from 'react';

export type SearchFiltersProps = {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
};

const SearchFilters = (props: SearchFiltersProps) => {
  const { sortBy, onSortChange } = props;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium text-gray-700">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
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
  );
};

export default SearchFilters;
