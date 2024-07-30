import { UserRole } from '../models/User';

interface UserAttributes {
    id: number;
    username: string;
    password: string;
    role: UserRole;
    first_name: string;
    last_name: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export { UserAttributes };