import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Order from './order';
import Product from './product';
import { OrderItemAttributes } from './interfaces';

class OrderItem extends Model<OrderItemAttributes> implements OrderItemAttributes {
    public id!: number;
    public orderId!: number;
    public productId!: number;
    public quantity!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

OrderItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            field: 'order_id',
            allowNull: false,
            references: {
                model: Order,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        productId: {
            type: DataTypes.INTEGER,
            field: 'product_id',
            allowNull: false,
            references: {
                model: Product,
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'OrderItem',
        tableName: 'order_items',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });

export default OrderItem;
