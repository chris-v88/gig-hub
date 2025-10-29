import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../ui/Icon';
import StarRating from '../ui/StarRating';
import type { Gig } from '../../api/gig';

export type GigCardProps = {
  gig: Gig;
};

const GigCard = (props: GigCardProps) => {
  const { gig } = props;

  return (
    <Link to={`/gig/${gig.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        {/* Gig Image */}
        <div className="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
          {gig.images && gig.images.length > 0 ? (
            <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover" />
          ) : gig.image_url ? (
            <img src={gig.image_url} alt={gig.title} className="w-full h-full object-cover" />
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
            <StarRating rating={gig.average_rating ?? 0} size={12} showHalfStars className="mr-2" />
            <span className="text-sm text-gray-600">
              ({gig.total_reviews > 0 ? gig.total_reviews : 'New'})
            </span>
          </div>

          {/* Price and Delivery */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-bold text-gray-900">
                ${gig.starting_price || gig.price}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              <Icon name="Clock" size={12} className="inline mr-1" />
              {gig.delivery_time} days
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
