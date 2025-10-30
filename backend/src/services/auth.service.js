import * as bcrypt from 'bcrypt';

import { BadRequestException, UnauthorizedException } from '../common/helpers/exception.helper.js';
import prisma from '../common/prisma/init.prisma.js';
import { tokenService } from './token.service.js';
import { convertTimeToMilliseconds } from '../common/utils/convertors.js';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_REFRESH_EXPIRES_IN,
} from '../common/constants/app.constant.js';

export const authService = {
  // From assignment: POST /api/auth/signup
  // From this app: POST /api/auth/signup
  signup: async (req) => {
    const { name, username, email, password, country } = req.body;
    
    // Sanitize input data
    const sanitizedData = {
      name: name?.trim(),
      username: username?.trim(),
      email: email?.toLowerCase()?.trim(),
      password: password?.trim(),
      country: country?.trim()
    };

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!sanitizedData.email || !emailRegex.test(sanitizedData.email)) {
      throw new BadRequestException('Please enter a valid email address');
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!sanitizedData.password || !passwordRegex.test(sanitizedData.password)) {
      throw new BadRequestException('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    if (!sanitizedData.username || !usernameRegex.test(sanitizedData.username)) {
      throw new BadRequestException('Username must be 3-30 characters long and contain only letters, numbers, underscores, and hyphens');
    }

    // Validate name
    if (!sanitizedData.name || sanitizedData.name.length < 2) {
      throw new BadRequestException('Name must be at least 2 characters long');
    }

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email: sanitizedData.email },
          { username: sanitizedData.username }
        ]
      }
    });

    if (existingUser) {
      const field = existingUser.email === sanitizedData.email ? 'email' : 'username';
      throw new BadRequestException(`User with this ${field} already exists`);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(sanitizedData.password, 12);
    
    // Create user
    const newUser = await prisma.users.create({
      data: {
        name: sanitizedData.name,
        username: sanitizedData.username,
        email: sanitizedData.email,
        password: passwordHash,
        country: sanitizedData.country,
        role: 'user',
        is_online: false,
        total_orders_completed: 0
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        country: true,
        role: true,
        profile_image: true,
        created_at: true
      }
    });

    return newUser;
  },

  // From assignment: POST /api/auth/signin
  // From this app: POST /api/auth/login
  login: async (req, res) => {
    const { email, password } = req.body;
    
    const user = await prisma.users.findUnique({
      where: {
        email: email?.toLowerCase()?.trim(),
      },
    });
    
    if (!user) {
      throw new BadRequestException('Account does not exist');
    }
    
    if (!user.password) {
      throw new BadRequestException('Password does not exist');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Incorrect password');
    }

    const tokens = tokenService.generateTokens(user.id);

    // set cookies
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      maxAge: convertTimeToMilliseconds(ACCESS_TOKEN_EXPIRES_IN),
      sameSite: 'lax', // 'lax' for development
      secure: process.env.NODE_ENV === 'production',
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      maxAge: convertTimeToMilliseconds(ACCESS_REFRESH_EXPIRES_IN),
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: tokens.accessToken,
    };
  },

  authCheck: async (req, res) => {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    if (!accessToken || !refreshToken) throw new UnauthorizedException('Token has expired or is invalid');

    try {
      const decodedAccessToken = tokenService.verifyAccessToken(accessToken, {
        ignoreExpiration: true,
      });
      const decodedRefreshToken = tokenService.verifyRefreshToken(refreshToken);
      if (decodedAccessToken.userId !== decodedRefreshToken.userId)
        throw new UnauthorizedException('Token Invalid');

      const user = await prisma.users.findUnique({ where: { id: decodedRefreshToken.userId } });
      if (!user) throw new UnauthorizedException('Token Invalid');

      return { isAuthenticated: true, user };
    } catch (err) {
      throw new UnauthorizedException('Token has expired or is invalid');
    }
  },

  logout: async (req, res) => {
    // Clear cookies
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    return { message: 'Logged out successfully' };
  },

  getUserById: async (userId) => {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        profile_image: true,
        country: true,
        description: true,
        created_at: true,
      }
    });

    return user;
  },

  remove: async (req) => {
    return `This action removes a id: ${req.params.id} auth`;
  },
};