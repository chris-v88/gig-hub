import prisma from '../common/prisma/init.prisma.js';
import { BadRequestException } from '../common/helpers/exception.helper.js';

export const subcategoryService = {
  // GET /api/chi-tiet-loai-cong-viec
  findAll: async (req) => {
    const subcategories = await prisma.subcategories.findMany({
      include: {
        category: {
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

  // POST /api/chi-tiet-loai-cong-viec
  create: async (req) => {
    const { tenChiTiet } = req.body;

    if (!tenChiTiet) {
      throw new BadRequestException('Subcategory name is required');
    }

    const subcategory = await prisma.subcategories.create({
      data: {
        name: tenChiTiet,
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
      prisma.subcategories.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: {
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
      prisma.subcategories.count({ where }),
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

    const subcategory = await prisma.subcategories.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: {
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
    const { tenChiTiet } = req.body;

    if (!tenChiTiet) {
      throw new BadRequestException('Subcategory name is required');
    }

    const subcategory = await prisma.subcategories.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subcategory) {
      throw new BadRequestException('Subcategory not found');
    }

    const updatedSubcategory = await prisma.subcategories.update({
      where: { id: parseInt(id) },
      data: {
        name: tenChiTiet,
      },
    });

    return updatedSubcategory;
  },

  // DELETE /api/chi-tiet-loai-cong-viec/:id
  remove: async (req) => {
    const { id } = req.params;

    const subcategory = await prisma.subcategories.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subcategory) {
      throw new BadRequestException('Subcategory not found');
    }

    await prisma.subcategories.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Subcategory deleted successfully' };
  },

  // POST /api/chi-tiet-loai-cong-viec/them-nhom-chi-tiet-loai
  createGroup: async (req) => {
    const { tenChiTiet, maLoaiCongViec, danhSachChiTiet } = req.body;

    if (!tenChiTiet || !maLoaiCongViec) {
      throw new BadRequestException('Group name and category ID are required');
    }

    // Create main subcategory
    const mainSubcategory = await prisma.subcategories.create({
      data: {
        name: tenChiTiet,
        category_id: parseInt(maLoaiCongViec),
      },
    });

    // If there are child subcategories, create them
    if (danhSachChiTiet && Array.isArray(danhSachChiTiet)) {
      const childSubcategories = await Promise.all(
        danhSachChiTiet.map(childId =>
          prisma.subcategories.update({
            where: { id: parseInt(childId) },
            data: {
              category_id: parseInt(maLoaiCongViec),
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

  // PUT /api/chi-tiet-loai-cong-viec/sua-nhom-chi-tiet-loai/:id
  updateGroup: async (req) => {
    const { id } = req.params;
    const { tenChiTiet, maLoaiCongViec, danhSachChiTiet } = req.body;

    const subcategory = await prisma.subcategories.findUnique({
      where: { id: parseInt(id) },
    });

    if (!subcategory) {
      throw new BadRequestException('Subcategory group not found');
    }

    // Update main subcategory
    const updatedSubcategory = await prisma.subcategories.update({
      where: { id: parseInt(id) },
      data: {
        name: tenChiTiet,
        category_id: maLoaiCongViec ? parseInt(maLoaiCongViec) : subcategory.category_id,
      },
    });

    // Update child subcategories if provided
    if (danhSachChiTiet && Array.isArray(danhSachChiTiet)) {
      const childSubcategories = await Promise.all(
        danhSachChiTiet.map(childId =>
          prisma.subcategories.update({
            where: { id: parseInt(childId) },
            data: {
              category_id: maLoaiCongViec ? parseInt(maLoaiCongViec) : subcategory.category_id,
            },
          })
        )
      );

      return {
        updatedSubcategory,
        childSubcategories,
      };
    }

    return updatedSubcategory;
  },

  // POST /api/chi-tiet-loai-cong-viec/upload-hinh-nhom-loai-cong-viec/:MaNhomLoaiCongViec
  uploadGroupImage: async (req) => {
    const { MaNhomLoaiCongViec } = req.params;

    // This would need Cloudinary integration
    // For now, return a placeholder response
    return {
      message: 'Image upload functionality needs Cloudinary integration',
      groupId: MaNhomLoaiCongViec,
    };
  },
};