import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { errorResponse, logger } from "../utils";
import { StatusCodes } from "http-status-codes";

export const UserValidationMiddleware = ({ validateName = false }: { validateName?: boolean }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Validating Request Body");

      const userSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6),
        ...(validateName && { name: z.string().min(3) })
      });

      userSchema.parse(req.body);
      next();
    } catch (error) {
      logger.error("User Validation Failed", error);
      return errorResponse(res, "User Validation Failed", StatusCodes.BAD_REQUEST);
    }
  };
};