import Username from "@models/Username";
import { errorResponse, successResponse } from "@utils/response";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class SearchController {
  async getSearchResult(req: Request, res: Response) {
    try {
      const username = req.username;
      const user = await Username.findOne({ username });
      if (!user) {
        return errorResponse(res, "User not found", StatusCodes.NOT_FOUND);
      }

      return successResponse(res, user, "User found", StatusCodes.OK);
    } catch (error : any) {
      return errorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new SearchController();