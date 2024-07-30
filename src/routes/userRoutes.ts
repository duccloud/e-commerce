import { Router } from 'express';
import { getUserBasicInfo, updateUserProfile, deleteUser } from '../controllers/userController';
import { validateJwt, authorizeRequest } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', validateJwt, authorizeRequest, getUserBasicInfo);
router.put('/:id', validateJwt, authorizeRequest, updateUserProfile);
router.delete('/:id', validateJwt, authorizeRequest, deleteUser);

export default router;
