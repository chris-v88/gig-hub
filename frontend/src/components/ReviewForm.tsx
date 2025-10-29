import React, { useState } from 'react';
import { Star } from 'lucide-react';
import Button from './ui/Button';
import { Card } from './ui/Card';

import reviewApi from '../api/review';

type ReviewFormProps = {
  gigId: number;
  onSuccess?: (review: unknown) => void;
  onCancel?: () => void;
};

const ReviewForm = ({ gigId, onSuccess, onCancel }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (content.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    setLoading(true);
    try {
      // Get current user ID from localStorage or auth context
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const reviewData = {
        maCongViec: gigId,
        maNguoiBinhLuan: parseInt(userId),
        noiDung: content.trim(),
        saoBinhLuan: rating,
      };

      const review = await reviewApi.create(reviewData);

      if (onSuccess) {
        onSuccess(review);
      }

      // Reset form
      setRating(0);
      setContent('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error submitting review';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Review</h3>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`h-8 w-8 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Select rating'}
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience with this gig..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            maxLength={1000}
          />
          <div className="mt-1 text-sm text-gray-500">{content.length}/1000 characters</div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default ReviewForm;
