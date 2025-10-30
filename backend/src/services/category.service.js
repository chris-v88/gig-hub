import prisma from '../common/prisma/init.prisma.js';
import { BadRequestException } from '../common/helpers/exception.helper.js';

export const categoryService = {
  // GET /api/loai-cong-viec
  findAll: async (req) => {
    const categories = await prisma.categories.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  },

  // From assignment: POST /api/loai-cong-viec
  // From this app: POST /api/categories
  create: async (req) => {
    const { name } = req.body;

    if (!name) {
      throw new BadRequestException('Job category name is required');
    }

    const category = await prisma.categories.create({
      data: {
        name: name,
      },
    });

    return category;
  },

  // GET /api/loai-cong-viec/phan-trang-tim-kiem
  searchPagination: async (req) => {
    const { pageIndex = 1, pageSize = 10, keyword = '' } = req.query;
    const page = parseInt(pageIndex);
    const limit = parseInt(pageSize);
    const skip = (page - 1) * limit;

    const where = keyword ? {
      name: {
        contains: keyword,
      },
    } : {};

    const [categories, total] = await Promise.all([
      prisma.categories.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.categories.count({ where }),
    ]);

    return {
      data: categories,
      totalRow: total,
      pageIndex: page,
      pageSize: limit,
      totalPage: Math.ceil(total / limit),
    };
  },

  // GET /api/loai-cong-viec/:id
  findOne: async (req) => {
    const { id } = req.params;

    const category = await prisma.categories.findUnique({
      where: { id: parseInt(id) },
      include: {
        Subcategories: true,
      },
    });

    if (!category) {
      throw new BadRequestException('Job category not found');
    }

    return category;
  },

  // From assignment: PUT /api/loai-cong-viec/{id}
  // From this app: PUT /api/categories/:id
  update: async (req) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      throw new BadRequestException('Job category name is required');
    }

    const category = await prisma.categories.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      throw new BadRequestException('Job category not found');
    }

    const updatedCategory = await prisma.categories.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
      },
    });

    return updatedCategory;
  },

  // DELETE /api/loai-cong-viec/:id
  remove: async (req) => {
    const { id } = req.params;

    const category = await prisma.categories.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      throw new BadRequestException('Job category not found');
    }

    await prisma.categories.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Job category deleted successfully' };
  },
};