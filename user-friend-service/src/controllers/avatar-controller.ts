import { errorResponse } from '@utils/response';
import { Request, Response } from 'express';
import { IUser } from 'src/types/user';

interface RequestUser extends Request {
    user?: IUser;
}

const updateAvatar = async (req: RequestUser, res: Response) => {
    try {
        const file = req.file;
    } catch (error: any) {
        return errorResponse(res, error.message || 'Internal Server Error', error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export default { updateAvatar };