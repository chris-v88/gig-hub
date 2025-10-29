import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../ui/StarRating';
import Icon from '../ui/Icon';
import type { Gig } from '../../api/gig';

export type FeaturedGigCardProps = {
  gig: Gig;
  variant?: 'default' | 'large' | 'compact';
  showCategory?: boolean;
};

const FeaturedGigCard = ({
  gig,
  variant = 'default',
  showCategory = true,
}: FeaturedGigCardProps) => {
  const isLarge = variant === 'large';
  const isCompact = variant === 'compact';

  return (
    <Link to={`/gig/${gig.id}`} className="group block">
      <div
        className={`
          bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow
          ${isLarge ? 'col-span-2 row-span-2' : ''}
          ${isCompact ? 'flex space-x-4' : ''}
        `}
      >
        {/* Image Container */}
        <div
          className={`
            relative overflow-hidden
            ${isCompact ? 'w-24 h-24 flex-shrink-0' : isLarge ? 'h-64' : 'h-48'}
            ${!isCompact ? 'mb-4' : ''}
          `}
        >
          <img
            src={gig.image_url || gig.images?.[0] || '/placeholder-gig.jpg'}
            alt={gig.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isLarge && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          )}
          {gig.average_rating >= 4.5 && (
            <div className="absolute top-2 left-2">
              <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Top Rated
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className={isCompact ? 'flex-1 py-1' : 'p-4'}>
          {/* Category Badge */}
          {showCategory && gig.category && (
            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                {gig.category.name}
              </span>
            </div>
          )}

          {/* Title */}
          <h3
            className={`
              font-semibold text-gray-900 group-hover:text-blue-600 transition-colors
              ${isLarge ? 'text-xl mb-3' : isCompact ? 'text-sm mb-1' : 'text-base mb-2'}
              line-clamp-2
            `}
          >
            {gig.title}
          </h3>

          {/* Description for large variant */}
          {isLarge && gig.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gig.description}</p>
          )}

          {/* User Info */}
          <div className={`flex items-center ${isCompact ? 'mb-1' : 'mb-3'}`}>
            <div
              className={`
                bg-gray-200 rounded-full flex items-center justify-center
                ${isCompact ? 'w-5 h-5 mr-2' : 'w-8 h-8 mr-3'}
              `}
            >
              <Icon name="User" size={isCompact ? 12 : 16} className="text-gray-600" />
            </div>
            <span
              className={`
                text-gray-700 font-medium
                ${isCompact ? 'text-xs' : 'text-sm'}
              `}
            >
              {gig.user?.name || 'Anonymous'}
            </span>
          </div>

          {/* Rating and Price Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <StarRating
                rating={gig.average_rating || 0}
                size={isCompact ? 12 : 16}
                showHalfStars
              />
              <span
                className={`
                  text-gray-600 font-medium
                  ${isCompact ? 'text-xs' : 'text-sm'}
                `}
              >
                ({gig.total_reviews || 0})
              </span>
            </div>
            <div className="text-right">
              <div
                className={`
                  text-gray-900 font-bold
                  ${isLarge ? 'text-lg' : isCompact ? 'text-sm' : 'text-base'}
                `}
              >
                From ${gig.price}
              </div>
              {!isCompact && <div className="text-xs text-gray-500">Starting at</div>}
            </div>
          </div>

          {/* Action button for large variant */}
          {isLarge && (
            <div className="mt-4">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors inline-block">
                View Details
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default FeaturedGigCard;
