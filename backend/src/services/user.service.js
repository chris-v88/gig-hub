import prisma from '../common/prisma/init.prisma.js';
import { BadRequestException } from '../common/helpers/exception.helper.js';
import bcrypt from 'bcrypt';

export const userService = {
  // GET /api/users
  findAll: async (req) => {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthday: true,
        gender: true,
        role: true,
        username: true,
        profile_image: true,
        description: true,
        country: true,
        is_online: true,
        total_orders_completed: true,
        created_at: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return users;
  },

  // POST /api/users
  create: async (req) => {
    const { name, email, password, phone, birthday, gender, role, skill, certification } = req.body;

    if (!name || !email || !password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        birthday: birthday ? new Date(birthday) : null,
        gender: gender || null,
        role: role || 'user',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthday: true,
        gender: true,
        role: true,
        username: true,
        profile_image: true,
        created_at: true,
      },
    });

    // Handle skills if provided
    if (skill && Array.isArray(skill)) {
      await Promise.all(
        skill.map(skillName =>
          prisma.user_skills.create({
            data: {
              user_id: user.id,
              skill_name: skillName,
            },
          })
        )
      );
    }

    // Handle certifications if provided
    if (certification && Array.isArray(certification)) {
      await Promise.all(
        certification.map(certName =>
          prisma.user_certifications.create({
            data: {
              user_id: user.id,
              certification_name: certName,
            },
          })
        )
      );
    }

    return user;
  },

  // DELETE /api/users
  remove: async (req) => {
    const { id } = req.query;

    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await prisma.users.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'User deleted successfully' };
  },

  // GET /api/users/phan-trang-tim-kiem
  searchPagination: async (req) => {
    const { pageIndex = 1, pageSize = 10, keyword = '' } = req.query;
    const page = parseInt(pageIndex);
    const limit = parseInt(pageSize);
    const skip = (page - 1) * limit;

    const where = keyword ? {
      OR: [
        {
          name: {
            contains: keyword,
          },
        },
        {
          email: {
            contains: keyword,
          },
        },
        {
          username: {
            contains: keyword,
          },
        },
      ],
    } : {};

    const [users, total] = await Promise.all([
      prisma.users.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          birthday: true,
          gender: true,
          role: true,
          username: true,
          profile_image: true,
          description: true,
          country: true,
          is_online: true,
          total_orders_completed: true,
          created_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      prisma.users.count({ where }),
    ]);

    return {
      data: users,
      totalRow: total,
      pageIndex: page,
      pageSize: limit,
      totalPage: Math.ceil(total / limit),
    };
  },

  // GET /api/users/:id
  findOne: async (req) => {
    const { id } = req.params;

    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthday: true,
        gender: true,
        role: true,
        username: true,
        profile_image: true,
        description: true,
        country: true,
        is_online: true,
        total_orders_completed: true,
        created_at: true,
        skills: {
          select: {
            skill_name: true,
          },
        },
        User_certifications: {
          select: {
            certification_name: true,
          },
        },
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      ...user,
      skill: user.skills.map(s => s.skill_name),
      certification: user.User_certifications.map(c => c.certification_name),
    };
  },

  // PUT /api/users/:id
  update: async (req) => {
    const { id } = req.params;
    const { name, email, phone, birthday, gender, role, skill, certification } = req.body;

    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
    }

    // Update user
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        name: name || user.name,
        email: email || user.email,
        phone: phone !== undefined ? phone : user.phone,
        birthday: birthday ? new Date(birthday) : user.birthday,
        gender: gender !== undefined ? gender : user.gender,
        role: role || user.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        birthday: true,
        gender: true,
        role: true,
        username: true,
        profile_image: true,
        created_at: true,
      },
    });

    // Update skills if provided
    if (skill && Array.isArray(skill)) {
      // Delete existing skills
      await prisma.user_skills.deleteMany({
        where: { user_id: parseInt(id) },
      });

      // Add new skills
      await Promise.all(
        skill.map(skillName =>
          prisma.user_skills.create({
            data: {
              user_id: parseInt(id),
              skill_name: skillName,
            },
          })
        )
      );
    }

    // Update certifications if provided
    if (certification && Array.isArray(certification)) {
      // Delete existing certifications
      await prisma.user_certifications.deleteMany({
        where: { user_id: parseInt(id) },
      });

      // Add new certifications
      await Promise.all(
        certification.map(certName =>
          prisma.user_certifications.create({
            data: {
              user_id: parseInt(id),
              certification_name: certName,
            },
          })
        )
      );
    }

    return updatedUser;
  },

  // GET /api/users/search/:TenNguoiDung
  searchByName: async (req) => {
    const { TenNguoiDung } = req.params;

    const users = await prisma.users.findMany({
      where: {
        name: {
          contains: TenNguoiDung,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        profile_image: true,
        description: true,
        country: true,
        total_orders_completed: true,
        created_at: true,
      },
      orderBy: {
        total_orders_completed: 'desc',
      },
    });

    return users;
  },

  // POST /api/users/upload-avatar
  uploadAvatar: async (req) => {
    // This would need Cloudinary integration
    // For now, return a placeholder response
    return {
      message: 'Avatar upload functionality needs Cloudinary integration',
      userId: req.user?.id || null,
    };
  },
};