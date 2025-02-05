import { Request, Response, NextFunction } from 'express';
import { verifyToken, errorResponse, config } from '../utils';
import { StatusCodes } from 'http-status-codes';
import User from '../models/User.model';
import { IUser } from '../types/user';

interface RequestUser extends Request {
  user?: IUser;
}

const authMiddleware = async (req: RequestUser, res: Response, next: NextFunction) => {
  console.log("====================================");
  console.log(req.headers);
  console.log("====================================");

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return errorResponse(res, 'No Bearer token', StatusCodes.UNAUTHORIZED);
  }

  const token = authHeader;

  try {
    const decoded = verifyToken(token, config.ACCESS_JWT_SECRET);
    if (!decoded) {
      return errorResponse(res, 'Token is invalid', StatusCodes.UNAUTHORIZED);
    }

    const user: IUser | null = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
  }
};

export default authMiddleware;