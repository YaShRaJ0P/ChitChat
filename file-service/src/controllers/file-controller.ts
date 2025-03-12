import { Request, Response } from "express";

class FileController {

    async getFile(req: Request, res: Response) {
        try {
            const file = req.body;
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            return res.status(200).json({ message: 'File uploaded successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
};

export default new FileController();