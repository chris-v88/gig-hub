import { tokenService } from '../../services/token.service.js';
import { UnauthorizedException } from '../helpers/exception.helper.js';
import prisma from '../prisma/init.prisma.js';

export const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || `Bearer ${req.cookies.access_token}`;
    if (!authorization) throw new UnauthorizedException('Not authorized');

    const [type, accessToken] = authorization.split(' ');
    if (type !== 'Bearer' || !accessToken) throw new UnauthorizedException('Unauthorized');

    const { userId } = tokenService.verifyAccessToken(accessToken);
    const user = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
