import prisma from '../common/prisma/init.prisma.js';
import { BadRequestException } from '../common/helpers/exception.helper.js';

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
        Reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Calculate actual ratings from reviews
    const gigsWithRatings = gigs.map(gig => {
      const reviews = gig.Reviews || [];
      const totalReviews = reviews.length;
      const averageRating = totalReviews > 0 
        ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1))
        : parseFloat(gig.average_rating || '0.0');
      
      return {
        ...gig,
        user: gig.Users, // Map Users relation to user for frontend compatibility
        Users: undefined, // Remove original relation
        Reviews: undefined, // Remove Reviews from response
        average_rating: averageRating,
        total_reviews: totalReviews > 0 ? totalReviews : (gig.total_reviews || 0),
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
      },
    });

    if (!gig) {
      throw new BadRequestException('Gig not found');
    }

    // Map Users relation to user for frontend compatibility
    return {
      ...gig,
      user: gig.Users,
      Users: undefined,
    };
  },

  update: async (req) => {
    return `This action updates gig #${req.params.id}`;
  },

  remove: async (req) => {
    return `This action removes gig #${req.params.id}`;
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

      // Get gigs with pagination and reviews for rating calculation
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
          Reviews: {
            select: {
              rating: true,
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      });

      // Calculate actual ratings from reviews
      const gigsWithRatings = gigs.map(gig => {
        const reviews = gig.Reviews || [];
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0 
          ? parseFloat((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1))
          : parseFloat(gig.average_rating || '0.0');
        
        return {
          ...gig,
          starting_price: gig.price, // Map price to starting_price for frontend compatibility
          user: gig.Users, // Map Users relation to user
          images: gig.images_rel?.map(img => img.image_url) || [gig.image_url].filter(Boolean), // Map images
          Users: undefined, // Remove original relation
          images_rel: undefined, // Remove original relation
          Reviews: undefined, // Remove Reviews from response
          average_rating: averageRating,
          total_reviews: totalReviews > 0 ? totalReviews : (gig.total_reviews || 0),
        };
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
};