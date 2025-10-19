import prisma from '../prisma/init.prisma.js';
import { BadRequestException } from '../helpers/exception.helper.js';

export const checkPermission = async (req, res, next) => {
  // user
  const user = req?.user;
  if (!user) {
    throw new BadRequestException('User not found');
  }

  // admin role gets access
  if (user.roleId === 1) {
    next();
    return;
  }

  // method
  const method = req.method;

  // endpoint
  const endpoint = req.baseUrl + req.route?.path;

  const rolePermission = await prisma.rolePermission.findFirst({
    where: {
      roleId: user.roleId,
      Permissions: {
        method: method,
        endpoint: endpoint,
      },
      isActive: true,
    },
  });

  if (!rolePermission) {
  throw new BadRequestException('❌ You do not have permission to access this resource');
  }

  next();
};
