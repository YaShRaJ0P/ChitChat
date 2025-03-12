import {Router} from "express";
import FileController from "../controllers/file-controller";

const FileRouter = Router();

FileRouter.get('/', FileController.getFile);
FileRouter.post('/', FileController.uploadFile);
FileRouter.delete('/', FileController.deleteFile);

export default FileRouter;