import { Router } from 'express';
import {
    createOrder,
    getOrder,
    updateOrder,
    deleteOrder,
    getAllOrders,
} from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);
router.get('/', getAllOrders);

export default router;
