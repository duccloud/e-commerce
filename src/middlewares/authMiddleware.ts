import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import { HTTP_STATUS } from '../constant/httpStatusCodes'

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const validateJwt = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   const token = req.headers.authorization?.split(' ')[1];

   if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Authorization token not found' });
   }

   try {
      const decodedToken = jwt.verify(token, JWT_SECRET) as { username: string };
      req.decodedToken = decodedToken;
      next();
   } catch (error) {
      console.error('Error verifying JWT:', error);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid or expired token' });
   }
};

export const authorizeRequest = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   // Authorization purpose
   next();
};
