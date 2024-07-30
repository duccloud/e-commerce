import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from '../models/User';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
const bcrypt = require('bcrypt');
import { ResourceNotFoundError } from '../errors/httpErrorHandlers'

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

export const updateUserProfile = async (req: Request, res: Response) => {
   const userId = parseInt(req.params.id, 10);
   const { username, password } = req.body;

   try {
      // Find the user by ID
      const user = await User.findByPk(userId);
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Update user attributes
      if (username) user.username = username;
      if (password) user.password = await bcrypt.hash(password, 10);

      // Save the updated user
      await user.save();

      // Respond with updated user data
      return res.status(200).json(user);
   } catch (error) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ message: 'An error occurred while updating the user profile' });
   }
};
