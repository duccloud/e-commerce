import { Router } from 'express';
import {
    createOrder,
    getOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
} from '../controllers/orderController';
import { validateJwt, authorizeRequest } from '../middlewares/authMiddleware';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/', validateJwt, authorizeRequest, rateLimiter, createOrder);
router.get('/:id', validateJwt, authorizeRequest, rateLimiter, getOrder);
router.put('/:id', validateJwt, authorizeRequest, rateLimiter, updateOrder);
router.delete('/:id', validateJwt, authorizeRequest, rateLimiter, deleteOrder);
router.get('/', validateJwt, authorizeRequest, rateLimiter, getAllOrders);

export default router;
