import jwt from 'jsonwebtoken';
import { responseError } from '../helpers/response.helpers.js';
import { statusCodes } from '../helpers/status-code.helper.js';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '../helpers/exception.helper.js';

/**
 * Error handling middleware for the application.
 * @param {*} err - The error object.
 * @param {*} req - The request object.
 * @param {*} res - The response object.
 * @param {*} next - The next middleware function.
 */
export const appError = (err, req, res, next) => {
  console.log('middleware appError executed');

  // Handle JWT errors
  if (err instanceof jwt.JsonWebTokenError) err.code = statusCodes.UNAUTHORIZED;
  if (err instanceof jwt.TokenExpiredError) err.code = statusCodes.FORBIDDEN;

  // Handle custom exceptions
  if (err instanceof BadRequestException) err.code = statusCodes.BAD_REQUEST;
  if (err instanceof UnauthorizedException) err.code = statusCodes.UNAUTHORIZED;
  if (err instanceof ForbiddenException) err.code = statusCodes.FORBIDDEN;

  const resData = responseError(err, err?.message, err?.code);
  
  // Convert to frontend format for consistency
  const frontendResponse = {
    success: false,
    message: err?.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err?.message : undefined,
    errors: err?.errors || undefined
  };

  res.status(resData.statusCode).json(frontendResponse);
};
