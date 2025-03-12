import { find } from './../../../../auth-service/node_modules/zod/lib/helpers/util.d';
import { IUser } from "../user";
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      file?: any;
    }
  }
}

export { };
