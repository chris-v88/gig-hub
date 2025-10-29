import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Flag } from 'lucide-react';
import { Card } from './ui/Card';
import Spinner from './ui/Spinner';
import reviewApi from '../api/review';

type ReviewData = {
  id: number;
  rating: number;
  content: string;
  review_date: string;
  reviewer?: {
    id: number;
    name: string;
    username?: string;
    profile_image?: string;
  };
};

type ReviewListProps = {
  gigId: number;
  refreshTrigger?: number;
};

const ReviewList = ({ gigId, refreshTrigger }: ReviewListProps) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await reviewApi.getByGig(gigId);
        setReviews(response);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error loading reviews';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [gigId, refreshTrigger]);

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`h-4 w-4 ${
              index < fullStars
                ? 'text-yellow-400 fill-current'
                : index === fullStars && hasHalfStar
                  ? 'text-yellow-400 fill-current opacity-50'
                  : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex justify-center">
          <Spinner size="md" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-600 text-center">
          <p>Error loading reviews: {error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Reviews ({reviews.length})</h3>
      </div>

      {reviews.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No reviews yet. Be the first to review this gig!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {review.reviewer?.profile_image ? (
                    <img
                      src={review.reviewer.profile_image}
                      alt={review.reviewer.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {review.reviewer?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {review.reviewer?.name || 'Anonymous'}
                      </h4>
                      {review.reviewer?.username && (
                        <p className="text-sm text-gray-500">@{review.reviewer.username}</p>
                      )}
                    </div>
                    <div className="text-right">
                      {renderStars(review.rating)}
                      <p className="text-sm text-gray-500 mt-1">{formatDate(review.review_date)}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                  </div>

                  {/* Review Actions */}
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Helpful</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-700">
                      <Flag className="h-4 w-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
