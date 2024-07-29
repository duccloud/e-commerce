import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User';
import { hashPassword, comparePasswords } from '../utils/passwordUtils';
import { sendResponse } from '../utils/responseUtils';
import { UserAttributes } from '../models/interfaces';
import { BadRequestError, DataError, ResourceNotFoundError, InvalidTokenError } from '../errors/httpErrorHandlers'
import { HTTP_STATUS } from '../constant/httpStatusCodes';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWWT_TOKEN_EXPIRE_TIME = process.env.JWWT_TOKEN_EXPIRE_TIME as string;

const validateUsername = (username: string): boolean => {
   // Username must be between 3 and 30 characters and only contain alphanumeric characters and underscores
   const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
   return usernameRegex.test(username);
};

const validatePassword = (password: string): boolean => {
   // Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one digit, and one special character
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   return passwordRegex.test(password);
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   const { username, password } = req.body;

   try {
      if (!username || !password) {
         next(new BadRequestError('Username and password are required'));
         return;
      }

      if (!validateUsername(username)) {
         next(new BadRequestError('Invalid username. It should be between 3 and 30 characters and contain only alphanumeric characters and underscores.'));
         return;
      }

      if (!validatePassword(password)) {
         next(new BadRequestError('Invalid password. It should be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one digit, and one special character.'));
         return;
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await User.create({
         username,
         password: hashedPassword,
      } as UserAttributes);

      sendResponse(res, HTTP_STATUS.CREATED, 'User registered successfully', { user: newUser });

   } catch (error) {
      next(error);
   }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   const { username, password } = req.body;

   try {
      if (!username || !password) {
         next(new BadRequestError('Username and password are required'));
         return;
      }

      const user = await User.findOne({ where: { username } });

      if (!user) {
         next(new ResourceNotFoundError('User not found'));
         return;
      }

      const isPasswordValid = await comparePasswords(password, user.password);

      if (!isPasswordValid) {
         next(new BadRequestError('Username or password is wrong'));
         return;
      }

      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWWT_TOKEN_EXPIRE_TIME });

      res.json({ token });
   } catch (error) {
      next(error);
   }
};
