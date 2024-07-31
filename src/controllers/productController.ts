import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import Category from '../models/product-category';
import logger from '../config/logger';

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, categoryId, inventoryCount } = req.body;

    try {
        // Validate that the category exists
        const category = await Category.findByPk(categoryId);
        if (!category) {
            logger.warn(`Category not found with ID: ${categoryId}`);
            return res.status(400).json({ message: 'Category not found' });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            categoryId,
            inventoryCount,
        });

        res.status(201).json(newProduct);
        logger.info(`Product added with ID: ${newProduct.id}`);
    } catch (error) {
        next(error);
    }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = parseInt(req.params.id, 10);
    const { name, description, price, categoryId, inventoryCount } = req.body;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            logger.warn(`Product not found with ID: ${productId}`);
            return res.status(404).json({ message: 'Product not found' });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (categoryId) {
            // Validate that the category exists
            const category = await Category.findByPk(categoryId);
            if (!category) {
                logger.warn(`Category not found with ID: ${categoryId}`);
                return res.status(400).json({ message: 'Category not found' });
            }
            product.categoryId = categoryId; // Update categoryId
        }
        if (inventoryCount) product.inventoryCount = inventoryCount;

        await product.save();
        res.status(200).json(product);
        logger.info(`Product with ID ${productId} updated`);
    } catch (error) {
        next(error);
    }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = parseInt(req.params.id, 10);

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            logger.warn(`Product not found with ID: ${productId}`);
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
        logger.info(`Product with ID ${productId} deleted successfully`);
    } catch (error) {
        next(error);
    }
};

export const viewProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = parseInt(req.params.id, 10);

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
        logger.info(`Product with ID ${productId} retrieved successfully`);
    } catch (error) {
        next(error);
    }
};

export const viewAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
        logger.info(`All products retrieved successfully`);
    } catch (error) {
        next(error);
    }
};
