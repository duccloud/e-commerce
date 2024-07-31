import { Router } from 'express';
import { getUserBasicInfo, updateUserProfile, deleteUser } from '../controllers/userController';
import { validateJwt, authorizeRequest } from '../middlewares/authMiddleware';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.get('/', validateJwt, authorizeRequest, rateLimiter, getUserBasicInfo);
router.put('/:id', validateJwt, authorizeRequest, rateLimiter, updateUserProfile);
router.delete('/:id', validateJwt, authorizeRequest, rateLimiter, deleteUser);

export default router;
