import { Router } from 'express';
import { getUserBasicInfo } from '../controllers/userController';
import { validateJwt, authorizeRequest } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', validateJwt, authorizeRequest, getUserBasicInfo);

export default router;
