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
    const { maCongViec, maNguoiBinhLuan, noiDung, saoBinhLuan } = req.body;

    if (!maCongViec || !maNguoiBinhLuan || !noiDung || !saoBinhLuan) {
      throw new BadRequestException('All fields are required');
    }

    // Check if gig exists
    const gig = await prisma.gigs.findUnique({
      where: { id: parseInt(maCongViec) },
      select: { id: true, seller_id: true },
    });

    if (!gig) {
      throw new BadRequestException('Gig not found');
    }

    // Check if user is trying to review their own gig
    if (gig.seller_id === parseInt(maNguoiBinhLuan)) {
      throw new BadRequestException('You cannot review your own gig');
    }

    // Find or create an order for this review
    let order = await prisma.orders.findFirst({
      where: {
        gig_id: parseInt(maCongViec),
        buyer_id: parseInt(maNguoiBinhLuan),
      },
    });

    if (!order) {
      // Create a basic order for the review
      order = await prisma.orders.create({
        data: {
          gig_id: parseInt(maCongViec),
          seller_id: gig.seller_id,
          buyer_id: parseInt(maNguoiBinhLuan),
          title: `Order for review`,
          description: 'Order created for review submission',
          price: 0,
          delivery_time: 1,
          revisions_included: 0,
          status: 'completed',
          completed: true,
          completed_at: new Date(),
        },
      });
    }

    const review = await prisma.reviews.create({
      data: {
        order_id: order.id,
        gig_id: parseInt(maCongViec),
        reviewer_id: parseInt(maNguoiBinhLuan),
        reviewee_id: gig.seller_id,
        reviewer_role: 'buyer',
        reviewee_role: 'seller',
        rating: parseInt(saoBinhLuan),
        content: noiDung,
        review_date: new Date(),
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

    // Update gig's average rating
    await updateGigRating(parseInt(maCongViec));

    return review;
  },

  // PUT /api/binh-luan/:id
  update: async (req) => {
    const { id } = req.params;
    const { noiDung, saoBinhLuan } = req.body;

    const review = await prisma.reviews.findUnique({
      where: { id: parseInt(id) },
    });

    if (!review) {
      throw new BadRequestException('Review not found');
    }

    const updatedReview = await prisma.reviews.update({
      where: { id: parseInt(id) },
      data: {
        content: noiDung || review.content,
        rating: saoBinhLuan ? parseInt(saoBinhLuan) : review.rating,
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