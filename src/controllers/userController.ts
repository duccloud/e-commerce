import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { InvalidTokenError, BadRequestError, DataError, ResourceNotFoundError } from '../errors/httpErrorHandlers'

dotenv.config();

export const getUserBasicInfo = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
   try {
      const username = req.decodedToken?.username;
      const user = await User.findOne({ where: { username } });

      if (!user) {
         next(new ResourceNotFoundError("User not found"));
         return;
      }

      res.json({ user });

   } catch (error) {
      next(error);
   }
}
