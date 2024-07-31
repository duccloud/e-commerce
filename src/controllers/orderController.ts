import { Request, Response, NextFunction } from 'express';
import Order, { OrderStatus } from '../models/order';
import OrderItem from '../models/order-item';
import Product from '../models/product';
import { OrderAttributes, OrderItemAttributes } from '../models/interfaces';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import sequelize from '../config/database';
import User from '../models/user';
import { sendEmail } from '../services/emailService';
import emailQueue from '../jobs/queue';
import logger from '../config/logger';

export const createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { items, totalPrice, status }: { items: OrderItemAttributes[], totalPrice: number, status: string } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const usernameFromToken = req.decodedToken?.username;
        const user = await User.findOne({ where: { username: usernameFromToken } });
        if (!user) {
            logger.warn(`User not found for username: ${usernameFromToken}`);
            return res.status(404).json({ message: 'User not found' });
        }

        // Convert status string to OrderStatus enum
        const orderStatus = OrderStatus[status as keyof typeof OrderStatus];
        if (!orderStatus) {
            await transaction.rollback();
            logger.warn(`Invalid order status: ${status}`);
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await Order.create({ totalPrice, status: orderStatus, userId: user.id }, { transaction });

        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction });
            if (!product) {
                await transaction.rollback();
                logger.error(`Product with id ${item.productId} not found`);
                throw new Error(`Product with id ${item.productId} not found`);
            }

            // Check inventory
            if (product.inventoryCount < item.quantity) {
                await transaction.rollback();
                logger.warn(`Insufficient inventory for product ${product.name}`);
                return res.status(400).json({ message: `Insufficient inventory for product ${product.name}` });
            }

            // Reduce inventory count
            product.inventoryCount -= item.quantity;

            // Update outOfStock flag
            const stockThreshold = parseInt(process.env.STOCK_THRESHOLD || '10', 10);
            product.outOfStock = product.inventoryCount < stockThreshold;

            await product.save({ transaction });

            // Create OrderItem
            await OrderItem.create({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
            }, { transaction });
        }

        // Send email notification
        // if (user.email) {
        //     await emailQueue.add({
        //         to: user.email,
        //         subject: 'Order Status Update',
        //         text: `Your order with ID ${order.id} has been created and is currently ${order.status}.`,
        //     });
        //     logger.info(`Email queued for user ${user.email}`);
        // }

        const orderWithItems = await Order.findByPk(order.id, {
            include: [OrderItem],
            transaction,
        });

        await transaction.commit();
        res.status(201).json(orderWithItems);
        logger.info(`Order with ID ${order.id} retrieved successfully`);
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.id, 10);

    try {
        const order = await Order.findByPk(orderId, {
            include: [OrderItem],
        });

        if (!order) {
            logger.warn(`Order not found with ID: ${orderId}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
        logger.info(`Order with ID ${orderId} retrieved successfully`);
    } catch (error) {
        next(error);
    }
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.id, 10);
    const { items, totalPrice, status }: { items: OrderItemAttributes[], totalPrice: number, status: string } = req.body;

    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            logger.warn(`Order not found with ID: ${orderId}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        if (totalPrice) order.totalPrice = totalPrice;
        if (status) {
            const orderStatus = OrderStatus[status as keyof typeof OrderStatus];
            if (!orderStatus) {
                logger.warn(`Invalid order status: ${status}`);
                return res.status(400).json({ message: 'Invalid order status' });
            }
            order.status = orderStatus;
        }

        await order.save();
        logger.info(`Order with ID ${orderId} updated`);

        if (items) {
            await OrderItem.destroy({ where: { orderId: order.id } });
            for (const item of items) {
                const product = await Product.findByPk(item.productId);
                if (!product) {
                    logger.error(`Product with id ${item.productId} not found`);
                    throw new Error(`Product with id ${item.productId} not found`);
                }
                await OrderItem.create({
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                });
            }
        }

        const updatedOrderWithItems = await Order.findByPk(order.id, {
            include: [OrderItem],
        });

        res.status(200).json(updatedOrderWithItems);
        logger.info(`Order with ID ${orderId} retrieved after update`);
    } catch (error) {
        next(error);
    }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.id, 10);

    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            logger.warn(`Order not found with ID: ${orderId}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.destroy();
        res.status(200).json({ message: 'Order deleted successfully' });
        logger.info(`Order with ID ${orderId} deleted successfully`);
    } catch (error) {
        next(error);
    }
};

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await Order.findAll({
            include: [OrderItem],
        });

        res.status(200).json(orders);
        logger.info(`All orders retrieved successfully`);
    } catch (error) {
        next(error);
    }
};
