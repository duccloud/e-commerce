import { Router } from 'express';
import { addProduct, updateProduct, deleteProduct, viewProduct, viewAllProducts } from '../controllers/productController';
import { validateJwt, authorizeRequest } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', validateJwt, authorizeRequest, addProduct);
router.put('/:id', validateJwt, authorizeRequest, updateProduct);
router.delete('/:id', validateJwt, authorizeRequest, deleteProduct);
router.get('/:id', validateJwt, authorizeRequest, viewProduct);
router.get('/', validateJwt, authorizeRequest, viewAllProducts);

export default router;
