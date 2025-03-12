import { Router } from 'express';
import { RequestSentController } from '../controllers';

const RequestSentRouter = Router();

RequestSentRouter.get('/', RequestSentController.getAllSentRequests);
RequestSentRouter.post('/request-sent/:friendId', RequestSentController.sendRequest);
RequestSentRouter.delete('/request-remove/:friendId', RequestSentController.removeRequest);

export default RequestSentRouter;