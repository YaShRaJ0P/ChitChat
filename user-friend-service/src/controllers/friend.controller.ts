import { IUser } from "src/types/user"
import { Request, Response } from "express"
import User from "@models/User.model"
import { errorResponse, successResponse } from "@utils/response"
import { StatusCodes } from "http-status-codes"
interface RequestUser extends Request {
    user?: IUser
}
const getAllFriends = async (req: RequestUser, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return errorResponse(res, 'Unauthorized', StatusCodes.UNAUTHORIZED);
        }
        const friends = await User.findOne({ _id: user._id }).populate('friends');
        return successResponse(res, friends, 'All friends are fetched', StatusCodes.OK);
    } catch (error: any) {
        return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

const remove = async (req: RequestUser, res: Response) => {
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

        if (!userData?.friends?.includes(friendData._id)) {
            return errorResponse(res, 'You are not friends', StatusCodes.NOT_FOUND);
        }

        userData?.friends?.splice(userData?.friends?.indexOf(friendData._id), 1);
        friendData?.friends?.splice(friendData?.friends?.indexOf(userData._id), 1);

        await userData.save();
        await friendData.save();

        return successResponse(res, {}, 'Friend removed', StatusCodes.OK);
    } catch (error: any) {
        return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default { getAllFriends, remove };