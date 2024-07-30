import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './interfaces';

export enum UserRole {
    ADMIN = 'ADMIN',
    MEMBER = 'MEMBER',
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
            type: DataTypes.ENUM(UserRole.ADMIN, UserRole.MEMBER),
            allowNull: false,
            defaultValue: UserRole.MEMBER,
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
    }
);

export default User;
