import prisma from '../common/prisma/init.prisma.js';
import { BadRequestException, UnauthorizedException } from '../common/helpers/exception.helper.js';

export const gigService = {
  create: async (req) => {
    return 'This action creates a gig';
  },

  findAll: async (req) => {
    const gigs = await prisma.gigs.findMany({
      take: 20,
      include: {
        Users: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            Reviews: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Use existing average_rating and total_reviews from database
    const gigsWithRatings = gigs.map(gig => {
      const { Users, _count, ...gigData } = gig;
      return {
        ...gigData,
        user: Users, // Map Users relation to user for frontend compatibility
        average_rating: parseFloat(gig.average_rating || '0.0'),
        total_reviews: _count.Reviews || gig.total_reviews || 0,
      };
    });

    return {
      gigs: gigsWithRatings,
      total: gigs.length,
    };
  },

  findOne: async (req) => {
    const { id } = req.params;
    
    const gig = await prisma.gigs.findUnique({
      where: { id: parseInt(id) },
      include: {
        Users: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
            description: true,
            total_orders_completed: true,
            created_at: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        images_rel: {
          select: {
            id: true,
            image_url: true,
          },
        },
        Reviews: {
          where: {
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
          take: 50, // Limit to recent 50 reviews
        },
      },
    });

    if (!gig) {
      throw new BadRequestException('Gig not found');
    }

    // Use existing ratings from database for performance
    const reviews = gig.Reviews || [];
    const totalReviews = reviews.length;
    const averageRating = parseFloat(gig.average_rating || '0.0');

    // Map Users relation to user for frontend compatibility
    const { Users, images_rel, Reviews: reviewsData, ...gigData } = gig;
    return {
      ...gigData,
      user: Users,
      images: images_rel?.map(img => img.image_url) || [gig.image_url].filter(Boolean),
      reviews: reviews.map(review => ({
        id: review.id,
        rating: review.rating,
        title: review.title,
        content: review.content,
        communication_rating: review.communication_rating,
        service_quality_rating: review.service_quality_rating,
        delivery_time_rating: review.delivery_time_rating,
        review_date: review.review_date,
        user: review.reviewer,
      })),
      average_rating: averageRating,
      total_reviews: totalReviews > 0 ? totalReviews : (gig.total_reviews || 0),
    };
  },

  update: async (req) => {
    return `This action updates gig #${req.params.id}`;
  },

  remove: async (req) => {
    return `This action removes gig #${req.params.id}`;
  },

  createReview: async (req) => {
    const { id } = req.params;
    const { 
      rating, 
      title, 
      content, 
      communication_rating, 
      service_quality_rating, 
      delivery_time_rating 
    } = req.body;
    
    // Get user from auth middleware (assuming it's available)
    const reviewer_id = req.user?.id;
    if (!reviewer_id) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if gig exists and get seller info
    const gig = await prisma.gigs.findUnique({
      where: { id: parseInt(id) },
      select: { 
        id: true, 
        title: true,
        price: true,
        delivery_time: true,
        revisions: true,
        seller_id: true,
        Users: {
          select: { id: true }
        }
      },
    });

    if (!gig) {
      throw new BadRequestException('Gig not found');
    }

    // Check if user is trying to review their own gig
    if (gig.seller_id === reviewer_id) {
      throw new BadRequestException('You cannot review your own gig');
    }

    // Find or create an order for this review
    let order = await prisma.orders.findFirst({
      where: {
        gig_id: parseInt(id),
        buyer_id: reviewer_id,
        seller_id: gig.seller_id,
      },
    });

    // If no order exists, create a basic one
    if (!order) {
      order = await prisma.orders.create({
        data: {
          gig_id: parseInt(id),
          seller_id: gig.seller_id,
          buyer_id: reviewer_id,
          title: `Order for: ${gig.title}`,
          description: 'Order created for review submission',
          price: parseFloat(gig.price),
          delivery_time: gig.delivery_time,
          revisions_included: gig.revisions || 0,
          status: 'completed',
          completed: true,
          completed_at: new Date(),
        },
      });
    }

    // Create review
    const review = await prisma.reviews.create({
      data: {
        order_id: order.id,
        gig_id: parseInt(id),
        reviewer_id,
        reviewee_id: gig.seller_id,
        reviewer_role: 'buyer',
        reviewee_role: 'seller',
        rating: parseInt(rating),
        title: title || null,
        content,
        communication_rating: communication_rating ? parseInt(communication_rating) : null,
        service_quality_rating: service_quality_rating ? parseInt(service_quality_rating) : null,
        delivery_time_rating: delivery_time_rating ? parseInt(delivery_time_rating) : null,
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

    // Update gig's average rating and total reviews
    const allReviews = await prisma.reviews.findMany({
      where: { 
        gig_id: parseInt(id),
        is_public: true,
      },
      select: { rating: true },
    });

    const totalReviews = allReviews.length;
    const averageRating = totalReviews > 0 
      ? parseFloat((allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2))
      : 0;

    await prisma.gigs.update({
      where: { id: parseInt(id) },
      data: {
        average_rating: averageRating,
        total_reviews: totalReviews,
      },
    });

    return {
      id: review.id,
      rating: review.rating,
      title: review.title,
      content: review.content,
      communication_rating: review.communication_rating,
      service_quality_rating: review.service_quality_rating,
      delivery_time_rating: review.delivery_time_rating,
      review_date: review.review_date,
      user: review.reviewer,
    };
  },

  search: async (req) => {
    const { query, category, sortBy = 'relevance', page = 1, limit = 20 } = req.query;
    
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Init where clause
    const where = {};
    
    // Add text search
    if (query) {
      where.OR = [
        {
          title: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
      ];
    }

    // Add category filter
    if (category && category !== 'all') {
      where.category = {
        name: {
          equals: category,
        },
      };
    }

    // Add status filter (only active gigs)
    where.status = 'active';

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'price_low':
        orderBy = { price: 'asc' };
        break;
      case 'price_high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { average_rating: 'desc' };
        break;
      case 'newest':
        orderBy = { created_at: 'desc' };
        break;
      default:
        // Default relevance sorting
        orderBy = { created_at: 'desc' };
    }

    try {
      // Get total count
      const total = await prisma.gigs.count({
        where,
      });

      // Get gigs with pagination using optimized query
      const gigs = await prisma.gigs.findMany({
        where,
        include: {
          Users: {
            select: {
              id: true,
              name: true,
              username: true,
              profile_image: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          images_rel: {
            select: {
              image_url: true,
            },
          },
          _count: {
            select: {
              Reviews: true,
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      });

      // Use existing ratings from database instead of calculating
      const gigsWithRatings = gigs.map(gig => {
        const { Users, images_rel, _count, ...gigData } = gig;
        const result = {
          ...gigData,
          starting_price: gig.price, // Map price to starting_price for frontend compatibility
          user: Users, // Map Users relation to user
          images: images_rel?.map(img => img.image_url) || [gig.image_url].filter(Boolean), // Map images
          average_rating: parseFloat(gig.average_rating || '0.0'),
          total_reviews: _count.Reviews || gig.total_reviews || 0,
        };
        
        return result;
      });

      const totalPages = Math.ceil(total / limitNum);

      return {
        gigs: gigsWithRatings,
        total,
        page: pageNum,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      };
    } catch (error) {
      console.error('Error searching gigs:', error);
      throw new BadRequestException('Error searching gigs');
    }
  },

  // GET /api/gigs/search-pagination
  searchPagination: async (req) => {
    return await gigService.search(req); // Use existing search method
  },

  // POST /api/gigs/upload-image/:gig_id
  uploadGigImage: async (req) => {
    const { gig_id } = req.params;
    
    // This would need Cloudinary integration
    // For now, return a placeholder response
    return {
      message: 'Image upload functionality needs Cloudinary integration',
      gigId: gig_id,
    };
  },

  // GET /api/gigs/categories-menu
  getJobTypeMenu: async (req) => {
    const categories = await prisma.categories.findMany({
      include: {
        Subcategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  },

  // GET /api/gigs/category-details/:categoryId
  getJobTypeDetails: async (req) => {
    const { categoryId } = req.params;

    const category = await prisma.categories.findUnique({
      where: { id: parseInt(categoryId) },
      include: {
        Subcategories: {
          include: {
            Gigs: {
              select: {
                id: true,
                title: true,
                price: true,
                image_url: true,
              },
              take: 10, // Limit to 10 gigs per subcategory
            },
          },
        },
      },
    });

    if (!category) {
      throw new BadRequestException('Job category not found');
    }

    return category;
  },

  // GET /api/gigs/by-subcategory/:subcategory_id
  getGigsBySubcategory: async (req) => {
    const { subcategory_id } = req.params;

    const gigs = await prisma.gigs.findMany({
      where: {
        subcategory_id: parseInt(subcategory_id),
        status: 'active',
      },
      include: {
        Users: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        Subcategories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        average_rating: 'desc',
      },
    });

    const gigsWithRatings = gigs.map(gig => {
      const { Users, ...gigData } = gig;
      return {
        ...gigData,
        user: Users,
        average_rating: parseFloat(gig.average_rating || '0.0'),
        total_reviews: gig.total_reviews || 0,
      };
    });

    return gigsWithRatings;
  },

  // GET /api/gigs/details/:id
  getGigDetails: async (req) => {
    return await gigService.findOne(req); // Use existing findOne method
  },

  // GET /api/gigs/by-name/:gig_name
  getGigsByName: async (req) => {
    const { gig_name } = req.params;

    const gigs = await prisma.gigs.findMany({
      where: {
        title: {
          contains: gig_name,
        },
        status: 'active',
      },
      include: {
        Users: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        average_rating: 'desc',
      },
    });

    const gigsWithRatings = gigs.map(gig => {
      const { Users, ...gigData } = gig;
      return {
        ...gigData,
        user: Users,
        average_rating: parseFloat(gig.average_rating || '0.0'),
        total_reviews: gig.total_reviews || 0,
      };
    });

    return gigsWithRatings;
  },
};