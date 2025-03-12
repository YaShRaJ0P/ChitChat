import { Request, Response } from 'express';

class AvatarController {
    async updateAvatar(req: Request, res: Response) {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No file uploaded');
        }
        
    }
}

export default new AvatarController();