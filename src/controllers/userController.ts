import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import User from '../models/user';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
const bcrypt = require('bcrypt');
import { ResourceNotFoundError } from '../errors/httpErrorHandlers';
import logger from '../config/logger';

dotenv.config();

export const getUserBasicInfo = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
   try {
      const username = req.decodedToken?.username;
      const user = await User.findOne({ where: { username } });

      if (!user) {
         logger.warn(`User not found with username: ${username}`);
         next(new ResourceNotFoundError("User not found"));
         return;
      }

      res.json({ user });
      logger.info(`Retrieved basic info for user with username: ${username}`);

   } catch (error) {
      next(error);
   }
}

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   const { username, password, firstName, lastName } = req.body;

   try {
      const usernameFromToken = req.decodedToken?.username;
      const user = await User.findOne({ where: { username: usernameFromToken } });
      if (!user) {
         logger.warn(`User not found with username: ${usernameFromToken}`);
         return res.status(404).json({ message: 'User not found' });
      }

      // Update user attributes
      if (username) user.username = username;
      if (password) user.password = await bcrypt.hash(password, 10);
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;

      // Save the updated user
      await user.save();

      // Respond with updated user data
      logger.info(`User profile updated for username: ${usernameFromToken}`);
      return res.status(200).json(user);
   } catch (error) {
      return res.status(500).json({ message: 'An error occurred while updating the user profile' });
   }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
   const userIdToDelete = parseInt(req.params.id, 10);

   try {
      const usernameFromToken = req.decodedToken?.username;
      const currentUser = await User.findOne({ where: { username: usernameFromToken } });

      if (!currentUser) {
         logger.warn(`Current user not found with username: ${usernameFromToken}`);
         return res.status(404).json({ message: 'User not found' });
      }

      // Check if the current user is an admin
      if (currentUser.role !== 'ADMIN') {
         logger.warn(`User with username: ${usernameFromToken} attempted to delete user without admin privileges`);
         return res.status(403).json({ message: 'You do not have permission to perform this action' });
      }

      const userToDelete = await User.findByPk(userIdToDelete);
      if (!userToDelete) {
         logger.warn(`User to delete not found with ID: ${userIdToDelete}`);
         return res.status(404).json({ message: 'User to delete not found' });
      }

      await userToDelete.destroy();
      logger.info(`User with ID ${userIdToDelete} deleted successfully by user with username: ${usernameFromToken}`);
      return res.status(200).json({ message: 'User deleted successfully' });
   } catch (error) {
      return res.status(500).json({ message: 'An error occurred while deleting the user' });
   }
};