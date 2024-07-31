import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { OrderAttributes } from './interfaces';

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

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
    },
    {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default Order;
