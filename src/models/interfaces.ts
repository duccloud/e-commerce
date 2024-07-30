import { UserRole } from './user';

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
