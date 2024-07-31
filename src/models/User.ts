import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './interfaces';

export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
    SELLER = 'SELLER'
}

class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;
    public role!: UserRole;
    public firstName!: string;
    public lastName!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public toJSON(): Omit<UserAttributes, 'password'> {
        const { password, ...attributes } = this.get();
        return attributes;
    }
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM(UserRole.ADMIN, UserRole.SELLER, UserRole.CUSTOMER),
            allowNull: false,
            defaultValue: UserRole.CUSTOMER,
        },
        firstName: {
            type: DataTypes.STRING,
            field: 'first_name',
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            field: 'last_name',
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

export default User;
