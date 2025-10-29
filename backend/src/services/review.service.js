import prisma from '../common/prisma/init.prisma.js';
import { BadRequestException } from '../common/helpers/exception.helper.js';
import { updateGigRating } from '../common/helpers/gig.helper.js';

export const reviewService = {
  // GET /api/binh-luan
  findAll: async (req) => {
    const reviews = await prisma.reviews.findMany({
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
          },
        },
        reviewee: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        Gigs: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return reviews;
  },

  // POST /api/binh-luan
  create: async (req) => {
    const { gig_id, reviewer_id, content, rating } = req.body;

    if (!gig_id || !reviewer_id || !content || !rating) {
      throw new BadRequestException('Missing required fields: gig_id, reviewer_id, content, rating');
    }

    // Verify gig exists
    const gig = await prisma.gigs.findUnique({
      where: { id: parseInt(gig_id) },
      select: { id: true, seller_id: true },
    });

    if (!gig) {
      throw new BadRequestException('Gig not found');
    }

    // Check if user is trying to review their own gig
    if (gig.seller_id === parseInt(reviewer_id)) {
      throw new BadRequestException('You cannot review your own gig');
    }

    // Check if order exists and is completed
    const order = await prisma.orders.findFirst({
      where: {
        gig_id: parseInt(gig_id),
        AND: [
          {
            OR: [
              { buyer_id: parseInt(reviewer_id) },
              { seller_id: parseInt(reviewer_id) }
            ]
          },
          { completed: true }
        ]
      }
    });

    if (!order) {
      throw new BadRequestException('You can only review completed orders');
    }

    // Check if review already exists
    const existingReview = await prisma.reviews.findFirst({
      where: {
        gig_id: parseInt(gig_id),
        reviewer_id: parseInt(reviewer_id),
        order_id: order.id
      }
    });

    if (existingReview) {
      throw new BadRequestException('Review already exists for this order');
    }

    const review = await prisma.reviews.create({
      data: {
        order_id: order.id,
        gig_id: parseInt(gig_id),
        reviewer_id: parseInt(reviewer_id),
        reviewee_id: order.buyer_id === parseInt(reviewer_id) ? order.seller_id : order.buyer_id,
        reviewer_role: order.buyer_id === parseInt(reviewer_id) ? 'buyer' : 'seller',
        reviewee_role: order.buyer_id === parseInt(reviewer_id) ? 'seller' : 'buyer',
        rating: parseInt(rating),
        content: content,
        review_date: new Date()
      },
      include: {
        reviewer: {
          select: { id: true, name: true, username: true, profile_image: true }
        },
        reviewee: {
          select: { id: true, name: true, username: true, profile_image: true }
        },
        Gigs: {
          select: { id: true, title: true, price: true, image_url: true }
        }
      }
    });

    // Update gig's average rating
    await updateGigRating(parseInt(gig_id));

    return review;
  },

  // PUT /api/binh-luan/:id
  update: async (req) => {
    const { id } = req.params;
    const { content, rating } = req.body;

    const review = await prisma.reviews.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      throw new BadRequestException('Review not found');
    }

    const updatedReview = await prisma.reviews.update({
      where: { id: parseInt(id) },
      data: {
        content: content || review.content,
        rating: rating ? parseInt(rating) : review.rating,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
          },
        },
      },
    });

    // Recalculate gig's average rating
    await updateGigRating(review.gig_id);

    return updatedReview;
  },

  // DELETE /api/binh-luan/:id
  remove: async (req) => {
    const { id } = req.params;

    const review = await prisma.reviews.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      throw new BadRequestException('Review not found');
    }

    await prisma.reviews.delete({
      where: { id: parseInt(id) },
    });

    // Recalculate gig's average rating
    await updateGigRating(review.gig_id);

    return { message: 'Review deleted successfully' };
  },

  // GET /api/binh-luan/lay-binh-luan-theo-cong-viec/:MaCongViec
  getByGig: async (req) => {
    const { MaCongViec } = req.params;

    const reviews = await prisma.reviews.findMany({
      where: {
        gig_id: parseInt(MaCongViec),
        is_public: true,
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return reviews;
  },
};