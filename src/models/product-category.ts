import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

interface ProductCategoryAttributes {
    id?: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class ProductCategory extends Model<ProductCategoryAttributes> implements ProductCategoryAttributes {
    public id!: number;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ProductCategory.init(
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
    },
    {
        sequelize,
        modelName: 'ProductCategory',
        tableName: 'product_categories',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default ProductCategory;
