import { Router } from 'express';
import { getUserBasicInfo, updateUserProfile } from '../controllers/userController';
import { validateJwt, authorizeRequest } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', validateJwt, authorizeRequest, getUserBasicInfo);
router.put('/users/:id', updateUserProfile);

export default router;
