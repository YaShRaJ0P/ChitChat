import { Request, Response } from 'express';
import { successResponse, errorResponse, generateAccessToken, generateRefreshToken, verifyToken, generateUsername, setCookie, clearCookie } from '../utils';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.model';
import bcrypt from 'bcryptjs';
import { IUser } from 'src/types/user';

interface RequestUser extends Request {
  user?: IUser;
}

class AuthController {
  async signup(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      const username = generateUsername(name);
      const user: IUser = await User.create({ username, name, email, password, status: 'online' });

      // Generate tokens
      const accessToken = generateAccessToken({ id: user._id.toString(), email: user.email });
      const refreshToken = generateRefreshToken({ id: user._id.toString(), email: user.email });

      // Store refresh token in HTTP-only cookie
      setCookie(refreshToken, res);

      return successResponse(res, { accessToken, email, name, username: user.username }, 'User signed up successfully', StatusCodes.CREATED);
    } catch (error: any) {
      return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user: IUser | null = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return errorResponse(res, 'Invalid email or password', StatusCodes.UNAUTHORIZED);
      }

      user.status = 'online';
      await user.save();

      // Generate tokens
      const accessToken = generateAccessToken({ id: user._id.toString(), email: user.email });
      const refreshToken = generateRefreshToken({ id: user._id.toString(), email: user.email });

      // Store refresh token in HTTP-only cookie
      setCookie(refreshToken, res);

      return successResponse(res, { accessToken, email, name, username: user.username }, 'User logged in successfully', StatusCodes.OK);
    } catch (error: any) {
      return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async logout(req: RequestUser, res: Response) {
    try {
      const user = req.user;
      if (!user) {
        return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
      }

      user.status = 'offline';
      user.lastSeen = new Date();
      await user.save();

      // Clear refresh token cookie
      clearCookie(res);
      return successResponse(res, {}, 'User logged out successfully', StatusCodes.OK);

    } catch (error: any) {
      return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return errorResponse(res, 'No refresh token provided', StatusCodes.FORBIDDEN);
      }

      // Verify refresh token
      const user = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string);

      if (!user) {
        // Clear refresh token cookie
        clearCookie(res);
        return errorResponse(res, 'Invalid refresh token', StatusCodes.FORBIDDEN);
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken({ id: user.id, email: user.email });
      const newRefreshToken = generateRefreshToken({ id: user.id, email: user.email });

      // Store new refresh token in HTTP-only cookie
      setCookie(newRefreshToken, res);
      return successResponse(res, { accessToken: newAccessToken }, 'Token refreshed successfully', StatusCodes.OK);
    } catch (error: any) {
      return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }

  }
}

export default new AuthController();