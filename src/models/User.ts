import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { UserAttributes } from './interfaces';

class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public password!: string;

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
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users',
    }
);

export default User;
