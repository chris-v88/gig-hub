import prisma from '../prisma/init.prisma.js';

/**
 * Helper function to calculate and update gig's average rating and total reviews
 * @param {number} gigId - The ID of the gig to update
 * @returns {Promise<{averageRating: number, totalReviews: number}>} Updated rating stats
 */
export const updateGigRating = async (gigId) => {
  const allReviews = await prisma.reviews.findMany({
    where: { 
      gig_id: gigId,
      is_public: true,
    },
    select: { rating: true },
  });

  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0 
    ? parseFloat((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
    : 0;

  await prisma.gigs.update({
    where: { id: gigId },
    data: {
      average_rating: averageRating,
      total_reviews: totalReviews,
    },
  });

  return { averageRating, totalReviews };
};

/**
 * Helper function to increment gig's orders_completed count
 * @param {number} gigId - The ID of the gig to update
 * @returns {Promise<{ordersCompleted: number}>} Updated order count
 */
export const incrementGigOrdersCompleted = async (gigId) => {
  const updatedGig = await prisma.gigs.update({
    where: { id: gigId },
    data: {
      orders_completed: {
        increment: 1,
      },
    },
    select: {
      orders_completed: true,
    },
  });

  return { ordersCompleted: updatedGig.orders_completed };
};

/**
 * Helper function to increment user's total_orders_completed count
 * @param {number} userId - The ID of the user to update
 * @returns {Promise<{totalOrdersCompleted: number}>} Updated order count
 */
export const incrementUserOrdersCompleted = async (userId) => {
  const updatedUser = await prisma.users.update({
    where: { id: userId },
    data: {
      total_orders_completed: {
        increment: 1,
      },
    },
    select: {
      total_orders_completed: true,
    },
  });

  return { totalOrdersCompleted: updatedUser.total_orders_completed };
};