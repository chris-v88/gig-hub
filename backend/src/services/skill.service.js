import prisma from '../common/prisma/init.prisma.js';
import { BadRequestException } from '../common/helpers/exception.helper.js';

export const skillService = {
  // GET /api/skill
  findAll: async (req) => {
    const skills = await prisma.Skills.findMany({
      include: {
        UserSkills: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
        _count: {
          select: {
            UserSkills: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return skills;
  },

  // POST /api/skill
  create: async (req) => {
    const { tenSkill, moTa } = req.body;

    if (!tenSkill) {
      throw new BadRequestException('Skill name is required');
    }

    // Check if skill already exists
    const existingSkill = await prisma.Skills.findFirst({
      where: {
        name: tenSkill,
      },
    });

    if (existingSkill) {
      throw new BadRequestException('Skill with this name already exists');
    }

    const skill = await prisma.Skills.create({
      data: {
        name: tenSkill,
        description: moTa || '',
      },
    });

    return skill;
  },

  // GET /api/skill/phan-trang-tim-kiem
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
          description: {
            contains: keyword,
          },
        },
      ],
    } : {};

    const [skills, total] = await Promise.all([
      prisma.Skills.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              UserSkills: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.Skills.count({ where }),
    ]);

    return {
      data: skills,
      totalRow: total,
      pageIndex: page,
      pageSize: limit,
      totalPage: Math.ceil(total / limit),
    };
  },

  // GET /api/skill/:id
  findOne: async (req) => {
    const { id } = req.params;

    const skill = await prisma.Skills.findUnique({
      where: { id: parseInt(id) },
      include: {
        UserSkills: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profile_image: true,
              },
            },
          },
        },
        _count: {
          select: {
            UserSkills: true,
          },
        },
      },
    });

    if (!skill) {
      throw new BadRequestException('Skill not found');
    }

    return skill;
  },

  // PUT /api/skill/:id
  update: async (req) => {
    const { id } = req.params;
    const { tenSkill, moTa } = req.body;

    const skill = await prisma.Skills.findUnique({
      where: { id: parseInt(id) },
    });

    if (!skill) {
      throw new BadRequestException('Skill not found');
    }

    // Check if new name conflicts with existing skills
    if (tenSkill && tenSkill !== skill.name) {
      const existingSkill = await prisma.Skills.findFirst({
        where: {
          name: tenSkill,
          id: {
            not: parseInt(id),
          },
        },
      });

      if (existingSkill) {
        throw new BadRequestException('Skill with this name already exists');
      }
    }

    const updatedSkill = await prisma.Skills.update({
      where: { id: parseInt(id) },
      data: {
        name: tenSkill || skill.name,
        description: moTa !== undefined ? moTa : skill.description,
      },
      include: {
        _count: {
          select: {
            UserSkills: true,
          },
        },
      },
    });

    return updatedSkill;
  },

  // DELETE /api/skill/:id
  remove: async (req) => {
    const { id } = req.params;

    const skill = await prisma.Skills.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            UserSkills: true,
          },
        },
      },
    });

    if (!skill) {
      throw new BadRequestException('Skill not found');
    }

    // Check if skill is in use
    if (skill._count.UserSkills > 0) {
      throw new BadRequestException('Cannot delete skill that is assigned to users');
    }

    await prisma.Skills.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Skill deleted successfully' };
  },
};