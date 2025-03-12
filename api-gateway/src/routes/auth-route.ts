import { Router } from 'express';
import { UserValidationMiddleware, authMiddleware } from '../middleware';
import AuthController from '../controllers/auth-controller';

const AuthRouter = Router();

AuthRouter.post('/signup', UserValidationMiddleware({ validateName: true }), AuthController.signup);
AuthRouter.post('/login', UserValidationMiddleware({ validateName: false }), AuthController.login);
AuthRouter.post('/logout', authMiddleware, AuthController.logout);
AuthRouter.post('/refresh-token', AuthController.refreshToken);

export default AuthRouter;