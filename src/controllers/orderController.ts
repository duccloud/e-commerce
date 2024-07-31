import { Request, Response, NextFunction } from 'express';
import Order, { OrderStatus } from '../models/order';
import OrderItem from '../models/order-item';
import Product from '../models/product';
import { OrderAttributes, OrderItemAttributes } from '../models/interfaces';
import sequelize from '../config/database';

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { items, totalPrice, status }: { items: OrderItemAttributes[], totalPrice: number, status: string } = req.body;

    const transaction = await sequelize.transaction();

    try {
        // Convert status string to OrderStatus enum
        const orderStatus = OrderStatus[status as keyof typeof OrderStatus];
        if (!orderStatus) {
            await transaction.rollback();
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await Order.create({ totalPrice, status: orderStatus }, { transaction });

        for (const item of items) {
            const product = await Product.findByPk(item.productId, { transaction });
            if (!product) {
                await transaction.rollback();
                throw new Error(`Product with id ${item.productId} not found`);
            }

            // Check inventory
            if (product.inventoryCount < item.quantity) {
                await transaction.rollback();
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

        const orderWithItems = await Order.findByPk(order.id, {
            include: [OrderItem],
            transaction,
        });

        await transaction.commit();
        res.status(201).json(orderWithItems);
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
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
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
            return res.status(404).json({ message: 'Order not found' });
        }

        if (totalPrice) order.totalPrice = totalPrice;
        if (status) {
            const orderStatus = OrderStatus[status as keyof typeof OrderStatus];
            if (!orderStatus) {
                return res.status(400).json({ message: 'Invalid order status' });
            }
            order.status = orderStatus;
        }

        await order.save();

        if (items) {
            await OrderItem.destroy({ where: { orderId: order.id } });
            for (const item of items) {
                const product = await Product.findByPk(item.productId);
                if (!product) {
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
    } catch (error) {
        next(error);
    }
};

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = parseInt(req.params.id, 10);

    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.destroy();
        res.status(200).json({ message: 'Order deleted successfully' });
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
    } catch (error) {
        next(error);
    }
};
