import { authService } from '../services/auth.service.js';
import { tokenService } from '../services/token.service.js';
import { responseSuccess } from '../common/helpers/response.helpers.js';
import { statusCodes } from '../common/helpers/status-code.helper.js';

export const authController = {
  signup: async (req, res, next) => {
    try {
      const newUser = await authService.signup(req);

      const tokens = tokenService.generateTokens(newUser.id);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      const response = responseSuccess(
        {
          user: newUser,
          accessToken: tokens.accessToken,
        },
        'User registered successfully',
        statusCodes.CREATED,
      );

      // Convert to frontend format
      res.status(response.statusCode).json({
        success: true,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authService.login(req, res);

      const response = responseSuccess(
        {
          user: result.user,
          accessToken: result.accessToken,
        },
        'Login successful',
        statusCodes.OK,
      );

      // Convert to frontend format
      res.status(response.statusCode).json({
        success: true,
        message: response.message,
        data: response.data,
      });
    } catch (error) {
      next(error);
    }
  },
};
