import React from 'react';
import Icon from './Icon';

export type StarRatingProps = {
  rating: number;
  maxStars?: number;
  size?: number;
  showHalfStars?: boolean;
  className?: string;
};

const StarRating = (props: StarRatingProps) => {
  const { rating, maxStars = 5, size = 14, showHalfStars = false, className = '' } = props;

  const fullStars = Math.floor(rating);
  const hasHalfStar = showHalfStars && rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  const stars = [
    // Full stars
    ...Array.from({ length: fullStars }, (_, i) => (
      <Icon key={i} name="Star" size={size} className="text-yellow-400 fill-current" />
    )),
    // Half star (if enabled and needed)
    ...(hasHalfStar
      ? [<Icon key="half" name="StarHalf" size={size} className="text-yellow-400 fill-current" />]
      : []),
    // Empty stars
    ...Array.from({ length: emptyStars }, (_, i) => (
      <Icon key={`empty-${i}`} name="Star" size={size} className="text-gray-300" />
    )),
  ];

  return <div className={`flex items-center ${className}`}>{stars}</div>;
};

export default StarRating;
