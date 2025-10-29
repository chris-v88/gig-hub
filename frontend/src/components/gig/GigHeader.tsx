import React from 'react';
import Icon from '../ui/Icon';
import type { Gig } from '../../api/gig';

export type GigHeaderProps = {
  gig: Gig;
};

const GigHeader = (props: GigHeaderProps) => {
  const { gig } = props;

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{gig.title}</h1>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{gig.user.name.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{gig.user.name}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Icon name="Star" size={14} className="text-yellow-400 mr-1" />
                <span>{gig.average_rating}</span>
              </div>
              <span>({gig.total_reviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigHeader;
