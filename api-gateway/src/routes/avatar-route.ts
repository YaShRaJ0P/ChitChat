import { AvatarController } from '@controllers/index';
import {Router} from 'express';

const AvatarRouter = Router();

AvatarRouter.put('/', AvatarController.updateAvatar);

export default AvatarRouter;