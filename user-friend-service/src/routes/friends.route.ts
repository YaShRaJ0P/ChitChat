import { Router } from 'express';
import { FriendController } from '../controllers';

const FriendRouter = Router();

FriendRouter.get('/', FriendController.getAllFriends);
FriendRouter.delete('/remove/:friendId', FriendController.remove);

export default FriendRouter;