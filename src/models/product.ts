import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import ProductCategory from './product-category';

import { ProductAttributes } from './interfaces';

class Product extends Model<ProductAttributes> implements ProductAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: number;
    public categoryId!: number;
    public inventoryCount!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            field: 'category_id',
            references: {
                model: ProductCategory,
                key: 'id',
            },
            allowNull: false,
        },
        inventoryCount: {
            type: DataTypes.INTEGER,
            field: 'inventory_count',
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

Product.belongsTo(ProductCategory, { foreignKey: 'categoryId' });
ProductCategory.hasMany(Product, { foreignKey: 'categoryId' });

export default Product;