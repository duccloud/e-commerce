import { UserRole } from './user';
import { OrderStatus } from './order';

export interface UserAttributes {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductAttributes {
    id?: number;
    name: string;
    description: string;
    price: number;
    categoryId: number;
    inventoryCount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderAttributes {
    id?: number;
    totalPrice: number;
    status: OrderStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface OrderItemAttributes {
    id?: number;
    orderId: number;
    productId: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}
