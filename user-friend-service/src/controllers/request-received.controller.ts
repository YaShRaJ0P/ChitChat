import { IUser } from "src/types/user";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "@utils/response";
import { StatusCodes } from "http-status-codes";
import User from "@models/User.model";

interface RequestUser extends Request {
    user?: IUser;
}
const getAllRecievedRequests = async (req: RequestUser, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
        }
        const recievedFriendRequests = User.findOne({ _id: user._id }).populate('receivedFriendRequests');

        return successResponse(res, recievedFriendRequests, 'All recieved friend requests are fetched', StatusCodes.OK);
    } catch (error: any) {
        return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const accept = async (req: RequestUser, res: Response) => {
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
        userData?.receivedFriendRequests?.splice(userData?.receivedFriendRequests?.indexOf(friendData._id), 1);
        userData?.friends?.push(friendData._id);
        friendData?.sentFriendRequests?.splice(friendData?.sentFriendRequests?.indexOf(userData._id), 1);
        friendData?.friends?.push(userData._id);
        await userData.save();
        await friendData.save();
        return successResponse(res, {}, 'Friend request accepted', StatusCodes.OK);
    } catch (error: any) {
        return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const reject = async (req: RequestUser, res: Response) => {
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
        userData?.receivedFriendRequests?.splice(userData?.receivedFriendRequests?.indexOf(friendData._id), 1);
        friendData?.sentFriendRequests?.splice(friendData?.sentFriendRequests?.indexOf(userData._id), 1);
        await userData.save();
        return successResponse(res, {}, 'Friend request rejected', StatusCodes.OK);
    } catch (error: any) {
        return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default { getAllRecievedRequests, accept, reject };