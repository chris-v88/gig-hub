import prisma from '../common/prisma/init.prisma.js';
import { BadRequestException, UnauthorizedException } from '../common/helpers/exception.helper.js';

export const orderService = {
  // GET /api/thue-cong-viec
  findAll: async (req) => {
    const orders = await prisma.orders.findMany({
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            price: true,
            image_url: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
          },
        },
        buyer: {
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

    return orders;
  },

  // POST /api/thue-cong-viec
  create: async (req) => {
    const { maCongViec, maNguoiThue, ngayThue, hoanThanh } = req.body;

    if (!maCongViec || !maNguoiThue) {
      throw new BadRequestException('Gig ID and buyer ID are required');
    }

    // Get gig details
    const gig = await prisma.gigs.findUnique({
      where: { id: parseInt(maCongViec) },
      select: {
        id: true,
        title: true,
        price: true,
        delivery_time: true,
        revisions: true,
        seller_id: true,
      },
    });

    if (!gig) {
      throw new BadRequestException('Gig not found');
    }

    // Check if user is trying to order their own gig
    if (gig.seller_id === parseInt(maNguoiThue)) {
      throw new BadRequestException('You cannot order your own gig');
    }

    const order = await prisma.orders.create({
      data: {
        gig_id: parseInt(maCongViec),
        seller_id: gig.seller_id,
        buyer_id: parseInt(maNguoiThue),
        title: gig.title,
        description: `Order for: ${gig.title}`,
        price: parseFloat(gig.price),
        delivery_time: gig.delivery_time,
        revisions_included: gig.revisions || 0,
        status: 'pending',
        completed: hoanThanh || false,
        hire_date: ngayThue ? new Date(ngayThue) : new Date(),
        completed_at: hoanThanh ? new Date() : null,
      },
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            price: true,
            image_url: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return order;
  },

  // GET /api/thue-cong-viec/phan-trang-tim-kiem
  searchPagination: async (req) => {
    const { pageIndex = 1, pageSize = 10, keyword = '' } = req.query;
    const page = parseInt(pageIndex);
    const limit = parseInt(pageSize);
    const skip = (page - 1) * limit;

    const where = keyword ? {
      OR: [
        {
          title: {
            contains: keyword,
          },
        },
        {
          gig: {
            title: {
              contains: keyword,
            },
          },
        },
      ],
    } : {};

    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take: limit,
        include: {
          gig: {
            select: {
              id: true,
              title: true,
              price: true,
              image_url: true,
            },
          },
          seller: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
          buyer: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.orders.count({ where }),
    ]);

    return {
      data: orders,
      totalRow: total,
      pageIndex: page,
      pageSize: limit,
      totalPage: Math.ceil(total / limit),
    };
  },

  // GET /api/thue-cong-viec/:id
  findOne: async (req) => {
    const { id } = req.params;

    const order = await prisma.orders.findUnique({
      where: { id: parseInt(id) },
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            image_url: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
            description: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            username: true,
            profile_image: true,
          },
        },
        Reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    return order;
  },

  // PUT /api/thue-cong-viec/:id
  update: async (req) => {
    const { id } = req.params;
    const { ngayThue, hoanThanh, status } = req.body;

    const order = await prisma.orders.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Fix inconsistent completed_at logic: clear timestamp when uncompleting
    let completedAt;
    if (hoanThanh !== undefined) {
      completedAt = hoanThanh ? new Date() : null;
    } else {
      completedAt = order.completed_at;
    }

    const updatedOrder = await prisma.orders.update({
      where: { id: parseInt(id) },
      data: {
        completed: hoanThanh !== undefined ? hoanThanh : order.completed,
        completed_at: completedAt,
        hire_date: ngayThue ? new Date(ngayThue) : order.hire_date, // Fixed field name
        status: status || order.status,
      },
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return updatedOrder;
  },

  // DELETE /api/thue-cong-viec/:id
  remove: async (req) => {
    const { id } = req.params;

    const order = await prisma.orders.findUnique({
      where: { id: parseInt(id) },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    await prisma.orders.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Order deleted successfully' };
  },

  // GET /api/thue-cong-viec/lay-danh-sach-da-thue
  getUserOrders: async (req) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const orders = await prisma.orders.findMany({
      where: {
        buyer_id: userId,
      },
      include: {
        gig: {
          select: {
            id: true,
            title: true,
            price: true,
            image_url: true,
          },
        },
        seller: {
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

    return orders;
  },

  // POST /api/thue-cong-viec/hoan-thanh-cong-viec/:MaThueCongViec
  completeOrder: async (req) => {
    const { MaThueCongViec } = req.params;

    const order = await prisma.orders.findUnique({
      where: { id: parseInt(MaThueCongViec) },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const completedOrder = await prisma.orders.update({
      where: { id: parseInt(MaThueCongViec) },
      data: {
        completed: true,
        completed_at: new Date(),
        status: 'completed',
      },
      include: {
        gig: {
          select: {
            id: true,
            title: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update seller's total completed orders
    await prisma.users.update({
      where: { id: order.seller_id },
      data: {
        total_orders_completed: {
          increment: 1,
        },
      },
    });

    return completedOrder;
  },
};