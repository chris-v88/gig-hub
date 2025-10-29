import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Spinner from '../components/ui/Spinner';
import GigBreadcrumb from '../components/gig/GigBreadcrumb';
import GigHeader from '../components/gig/GigHeader';
import GigImageGallery from '../components/gig/GigImageGallery';
import GigDescription from '../components/gig/GigDescription';
import GigReviews from '../components/gig/GigReviews';
import GigOrderCard from '../components/gig/GigOrderCard';
import GigSellerInfo from '../components/gig/GigSellerInfo';
import { useAuthStore } from '../store/authStore';
import type { ReviewFormData } from '../schemas/validation';
import { gigAPI, type Gig, type CreateReviewData } from '../api/gig';

const GigPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { user } = useAuthStore();

  // Fetch gig data
  const {
    data: gigResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['gig', id],
    queryFn: () => gigAPI.getById(id || ''),
    enabled: !!id,
  });

  const gig: Gig | undefined = gigResponse?.data;

  // Review submission mutation
  const reviewMutation = useMutation({
    mutationFn: (reviewData: CreateReviewData) => gigAPI.createReview(id || '', reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gig', id] });
      setShowReviewForm(false);
    },
  });

  const handleToggleReviewForm = () => {
    setShowReviewForm(!showReviewForm);
  };

  const handleReviewSubmit = (data: ReviewFormData) => {
    reviewMutation.mutate({
      ...data,
      rating: data.rating || 1,
    });
  };

  const handleOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Handle order logic here
    alert('Order functionality not implemented yet');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-gray-600">Loading gig details...</p>
        </div>
      </div>
    );
  }

  if (error || !gig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Gig Not Found</h1>
          <p className="text-gray-600 mb-4">The gig you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <GigBreadcrumb gig={gig} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <GigHeader gig={gig} />

            <GigImageGallery gig={gig} />

            <GigDescription gig={gig} />

            <GigReviews
              gig={gig}
              user={user}
              showReviewForm={showReviewForm}
              onToggleReviewForm={handleToggleReviewForm}
              reviewMutation={reviewMutation}
              onReviewSubmit={handleReviewSubmit}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <GigOrderCard gig={gig} onOrderClick={handleOrderClick} />

              <GigSellerInfo gig={gig} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigPage;
