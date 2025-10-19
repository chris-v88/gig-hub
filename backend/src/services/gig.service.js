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
        user: {
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
        created_at: 'desc',
      },
    });

    return {
      gigs,
      total: gigs.length,
    };
  },

  findOne: async (req) => {
    const { id } = req.params;
    
    const gig = await prisma.gigs.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
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
            url: true,
          },
        },
      },
    });

    if (!gig) {
      throw new BadRequestException('Gig not found');
    }

    return gig;
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
    if (category) {
      where.category = {
        name: {
          equals: category,
        },
      };
    }

    // Add status filter (only active gigs)
    where.is_active = true;

    // Build orderBy clause
    let orderBy = {};
    switch (sortBy) {
      case 'price_low':
        orderBy = { starting_price: 'asc' };
        break;
      case 'price_high':
        orderBy = { starting_price: 'desc' };
        break;
      case 'rating':
        orderBy = { created_at: 'desc' }; // No rating column yet
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

      // Get gigs with pagination
      const gigs = await prisma.gigs.findMany({
        where,
        include: {
          user: {
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
        orderBy,
        skip,
        take: limitNum,
      });

      const totalPages = Math.ceil(total / limitNum);

      return {
        gigs,
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