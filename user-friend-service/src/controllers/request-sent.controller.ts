import User from "@models/User.model";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response";
import { StatusCodes } from "http-status-codes";
import { IUser } from 'src/types/user';

interface RequestUser extends Request {
  user?: IUser;
}
const getAllSentRequests = async (req: RequestUser, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }
    const sentFriendRequests = await User.findOne({ _id: user._id }).populate('sentFriendRequests');

    return successResponse(res, sentFriendRequests, 'All sent friend requests are fetched', StatusCodes.OK);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
  }
}


const sendRequest = async (req: RequestUser, res: Response) => {
  try {
    const user = req.user;
    const { friendId } = req.params;

    if (!user) {
      return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const userData: IUser | null = await User.findOne({ _id: user._id });
    if (!userData) {
      return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const friendData: IUser | null = await User.findOne({ _id: friendId });
    if (!friendData) {
      return errorResponse(res, 'Friend not found', StatusCodes.NOT_FOUND);
    }

    if (userData?.sentFriendRequests?.includes(friendData._id)) {
      return errorResponse(res, 'Friend request have already sent', StatusCodes.BAD_REQUEST);
    }

    userData?.sentFriendRequests?.push(friendData._id);
    friendData?.receivedFriendRequests?.push(user._id);
    await userData.save();
    await friendData.save();

    return successResponse(res, {}, 'Friend request sent', StatusCodes.OK);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

const removeRequest = async (req: RequestUser, res: Response) => {
  try {
    const user = req.user;
    const { friendId } = req.params;

    if (!user) {
      return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const userData: IUser | null = await User.findOne({ _id: user._id });
    if (!userData) {
      return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const friendData: IUser | null = await User.findOne({ _id: friendId });
    if (!friendData) {
      return errorResponse(res, 'Friend not found', StatusCodes.NOT_FOUND);
    }

    const indexAtUser: number | undefined = userData?.sentFriendRequests?.indexOf(friendData._id);
    const indexAtFriend: number | undefined = friendData?.receivedFriendRequests?.indexOf(user._id);

    if (indexAtUser === -1 || indexAtUser === undefined || indexAtFriend === -1 || indexAtFriend === undefined) {
      return errorResponse(res, 'Friend request have not sent', StatusCodes.BAD_REQUEST);
    }

    userData?.sentFriendRequests?.splice(indexAtUser, 1);
    friendData?.receivedFriendRequests?.splice(indexAtFriend, 1);
    await userData.save();
    await friendData.save();

    return successResponse(res, {}, 'Friend request removed', StatusCodes.OK);
  } catch (error: any) {
    return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export default { getAllSentRequests, sendRequest, removeRequest };