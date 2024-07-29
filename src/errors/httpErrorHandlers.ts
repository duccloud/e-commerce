import { HttpError } from './HttpError';
import { HTTP_STATUS } from '../constant/httpStatusCodes'

export class InvalidTokenError extends HttpError {
    constructor(message: string = 'Invalid token') {
        super(message, HTTP_STATUS.UNAUTHORIZED);
        Object.setPrototypeOf(this, InvalidTokenError.prototype);
    }
}

export class ResourceNotFoundError extends HttpError {
    constructor(message: string) {
        super(message, HTTP_STATUS.NOT_FOUND);
        Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string) {
        super(message, HTTP_STATUS.BAD_REQUEST);
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

export class DataError extends HttpError {
    constructor(message: string) {
        super(message, HTTP_STATUS.SERVER_ERROR);
        Object.setPrototypeOf(this, DataError.prototype);
    }
}