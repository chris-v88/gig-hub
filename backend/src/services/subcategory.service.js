import prisma from '../common/prisma/init.prisma.js';
import { BadRequestException } from '../common/helpers/exception.helper.js';

export const subcategoryService = {
  // GET /api/chi-tiet-loai-cong-viec
  findAll: async (req) => {
    const subcategories = await prisma.Subcategories.findMany({
      include: {
        Categories: {
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

    return subcategories;
  },

  // POST /api/subcategories
  create: async (req) => {
    const { name } = req.body;

    if (!name) {
      throw new BadRequestException('Subcategory name is required');
    }

    const subcategory = await prisma.Subcategories.create({
      data: {
        name: name,
      },
    });

    return subcategory;
  },

  // GET /api/chi-tiet-loai-cong-viec/phan-trang-tim-kiem
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

    const [subcategories, total] = await Promise.all([
      prisma.Subcategories.findMany({
        where,
        skip,
        take: limit,
        include: {
          Categories: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.Subcategories.count({ where }),
    ]);

    return {
      data: subcategories,
      totalRow: total,
      pageIndex: page,
      pageSize: limit,
      totalPage: Math.ceil(total / limit),
    };
  },

  // GET /api/chi-tiet-loai-cong-viec/:id
  findOne: async (req) => {
    const { id } = req.params;

    const subcategory = await prisma.Subcategories.findUnique({
      where: { id: parseInt(id) },
      include: {
        Categories: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!subcategory) {
      throw new BadRequestException('Subcategory not found');
    }

    return subcategory;
  },

  // PUT /api/chi-tiet-loai-cong-viec/:id
  update: async (req) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      throw new BadRequestException('Subcategory name is required');
    }

    const subcategory = await prisma.Subcategories.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subcategory) {
      throw new BadRequestException('Subcategory not found');
    }

    const updatedSubcategory = await prisma.Subcategories.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
      },
    });

    return updatedSubcategory;
  },

  // DELETE /api/chi-tiet-loai-cong-viec/:id
  remove: async (req) => {
    const { id } = req.params;

    const subcategory = await prisma.Subcategories.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subcategory) {
      throw new BadRequestException('Subcategory not found');
    }

    await prisma.Subcategories.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Subcategory deleted successfully' };
  },

  // POST /api/subcategories/create-group
  createGroup: async (req) => {
    const { name, category_id, subcategory_list } = req.body;

    if (!name || !category_id) {
      throw new BadRequestException('Group name and category ID are required');
    }

    // Create main subcategory
    const mainSubcategory = await prisma.Subcategories.create({
      data: {
        name: name,
        category_id: parseInt(category_id),
      },
    });

    // If there are child subcategories, create them
    if (subcategory_list && Array.isArray(subcategory_list)) {
      const childSubcategories = await Promise.all(
        subcategory_list.map(childId =>
          prisma.Subcategories.update({
            where: { id: parseInt(childId) },
            data: {
              category_id: parseInt(category_id),
            },
          })
        )
      );

      return {
        mainSubcategory,
        childSubcategories,
      };
    }

    return mainSubcategory;
  },

  // PUT /api/subcategories/update-group/:id
  updateGroup: async (req) => {
    const { id } = req.params;
    const { name, category_id, subcategory_list } = req.body;

    if (!name || !category_id) {
      throw new BadRequestException('Group name and category ID are required');
    }

    // Update main subcategory
    const updatedSubcategory = await prisma.Subcategories.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name: name,
        category_id: parseInt(category_id),
      },
    });

    // Update child subcategories if provided
    if (subcategory_list && Array.isArray(subcategory_list)) {
      await Promise.all(
        subcategory_list.map(childId =>
          prisma.Subcategories.update({
            where: { id: parseInt(childId) },
            data: {
              category_id: parseInt(category_id),
            },
          })
        )
      );
    }

    return updatedSubcategory;
  },

  // POST /api/subcategories/upload-group-image/:group_id
  uploadGroupImage: async (req) => {
    const { group_id } = req.params;

    // This would need Cloudinary integration
    // For now, return a placeholder response
    return {
      message: 'Image upload functionality needs Cloudinary integration',
      groupId: group_id,
    };
  },
};