import jwt from 'jsonwebtoken';
import { UnauthorizedException } from '../common/helpers/exception.helper.js';
import { 
  ACCESS_TOKEN_KEY, 
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_REFRESH_SECRET,
  ACCESS_REFRESH_EXPIRES_IN 
} from '../common/constants/app.constant.js';

export const tokenService = {
  generateAccessToken: (userId) => {
    return jwt.sign(
      { userId },
      ACCESS_TOKEN_KEY,
      { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
  },

  generateRefreshToken: (userId) => {
    return jwt.sign(
      { userId },
      ACCESS_REFRESH_SECRET,
      { expiresIn: ACCESS_REFRESH_EXPIRES_IN }
    );
  },

  verifyAccessToken: (token, options = {}) => {
    try {
      return jwt.verify(token, ACCESS_TOKEN_KEY, options);
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  },

  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, ACCESS_REFRESH_SECRET);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  },

  generateTokens: (userId) => {
    const accessToken = tokenService.generateAccessToken(userId);
    const refreshToken = tokenService.generateRefreshToken(userId);
    
    return { accessToken, refreshToken };
  },

  createTokens: (userId) => {
    return tokenService.generateTokens(userId);
  }
};