import { Router } from 'express';
import { addProduct, updateProduct, deleteProduct, viewProduct, viewAllProducts } from '../controllers/productController';
import { validateJwt, authorizeRequest } from '../middlewares/authMiddleware';
import { rateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/', validateJwt, authorizeRequest, rateLimiter, addProduct);
router.put('/:id', validateJwt, authorizeRequest, rateLimiter, updateProduct);
router.delete('/:id', validateJwt, authorizeRequest, rateLimiter, deleteProduct);
router.get('/:id', validateJwt, authorizeRequest, rateLimiter, viewProduct);
router.get('/', validateJwt, authorizeRequest, rateLimiter, viewAllProducts);

export default router;
