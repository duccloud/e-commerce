import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/HttpError';
import { HTTP_STATUS } from '../constant/httpStatusCodes'

export const errorHandler = (
   err: Error,
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   if (err instanceof HttpError) {
      res.status(err.statusCode).json({ message: err.message });
   } else {
      res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Something went wrong' });
   }
};