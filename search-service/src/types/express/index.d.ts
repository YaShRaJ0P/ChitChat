import { IUsername } from "../username";
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      username?: IUsername;
    }
  }
}

export { };
