import { Router } from 'express';
import { RequestRecievedController } from '../controllers';

const RequestReceivedRouter = Router();

RequestReceivedRouter.get('/', RequestRecievedController.getAllRecievedRequests);
RequestReceivedRouter.post('/accept/:friendId', RequestRecievedController.accept);
RequestReceivedRouter.delete('/reject/:friendId', RequestRecievedController.reject);

export default RequestReceivedRouter;