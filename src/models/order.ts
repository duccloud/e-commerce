import { DataTypes, Model, Association } from 'sequelize';
import sequelize from '../config/database';
import { OrderAttributes } from './interfaces';
import User from './user';
import emailQueue from '../jobs/queue';

export enum OrderStatus {
    PENDING = 'PENDING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

class Order extends Model<OrderAttributes> implements OrderAttributes {
    public id!: number;
    public totalPrice!: number;
    public status!: OrderStatus;
    public userId!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associations: {
        user: Association<Order, User>;
    };

    public async queueStatusUpdateEmail(): Promise<void> {
        try {
            const user = await User.findByPk(this.userId);
            if (user && user.email) {
                await emailQueue.add({
                    recipient: user.email,
                    subject: 'Order Status Update',
                    text: `Your order with ID ${this.id} has been updated to ${this.status}.`,
                });
            }
        } catch (error) {
            console.error('Error queuing email job:', error);
        }
    }
}

Order.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        totalPrice: {
            type: DataTypes.FLOAT,
            field: 'total_price',
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(OrderStatus.PENDING, OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED),
            allowNull: false,
            defaultValue: OrderStatus.PENDING,
        },
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id',
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        hooks: {
            afterSave: async (order: Order, options: any) => {
                if (order.changed('status')) {
                    // await order.queueStatusUpdateEmail();
                }
            },
        },
    }
);

export default Order;
