import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UseMutationResult } from '@tanstack/react-query';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { reviewSchema, type ReviewFormData } from '../../schemas/validation';
import type { Gig, CreateReviewData, CreateReviewResponse } from '../../api/gig';

export type GigReviewsProps = {
  gig: Gig;
  user?: { id: number; name: string } | null;
  showReviewForm: boolean;
  onToggleReviewForm: () => void;
  reviewMutation: UseMutationResult<CreateReviewResponse, Error, CreateReviewData>;
  onReviewSubmit: (data: ReviewFormData) => void;
};

const GigReviews = (props: GigReviewsProps) => {
  const { gig, user, showReviewForm, onToggleReviewForm, reviewMutation, onReviewSubmit } = props;
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const handleStarClick = (rating: number) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  const handleFormSubmit = (data: ReviewFormData) => {
    if (selectedRating === 0) {
      alert('Please select a rating');
      return;
    }
    onReviewSubmit({ ...data, rating: selectedRating });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Reviews ({gig.reviews?.length || 0})
          {user && (
            <Button variant="outline" size="sm" onClick={onToggleReviewForm}>
              {showReviewForm ? 'Cancel' : 'Write Review'}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showReviewForm && (
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className={
                      star <= selectedRating
                        ? 'text-yellow-400'
                        : 'text-gray-300 hover:text-yellow-400'
                    }
                  >
                    <Icon name="Star" size={20} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title (Optional)
              </label>
              <input
                {...register('title')}
                placeholder="Review title..."
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                {...register('content')}
                placeholder="Share your experience..."
                rows={4}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
              )}
            </div>
            <div className="flex space-x-3">
              <Button type="submit" tone="primary" disabled={reviewMutation.isPending}>
                {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button type="button" variant="outline" onClick={onToggleReviewForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {gig.reviews && gig.reviews.length > 0 ? (
            gig.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-700 font-bold text-sm">
                      {review.user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(review.review_date).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && (
                      <h5 className="font-medium text-gray-800 mb-1">{review.title}</h5>
                    )}
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={14}
                          className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No reviews yet. Be the first to review this gig!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GigReviews;
