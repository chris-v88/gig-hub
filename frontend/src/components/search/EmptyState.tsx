import React from 'react';
import Icon from '../ui/Icon';

export type EmptyStateProps = {
  type: 'no-search' | 'no-results' | 'error';
  error?: Error | string;
};

const EmptyState = (props: EmptyStateProps) => {
  const { type, error } = props;

  if (type === 'no-search') {
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

  if (type === 'error') {
    return (
      <div className="text-center py-12">
        <Icon name="AlertCircle" size={48} className="text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p className="text-gray-600">
          {typeof error === 'string' ? error : 'Please try again later'}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <Icon name="Search" size={48} className="text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
      <p className="text-gray-600">Try adjusting your search terms or browse our categories</p>
    </div>
  );
};

export default EmptyState;
