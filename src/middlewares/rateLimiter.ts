import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import User, { UserRole } from '../models/user';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';

const createRateLimiter = (maxRequests: number) => rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: maxRequests,
    handler: (req: Request, res: Response) => {
        res.status(429).json({ message: 'Too many requests, please try again later.' });
    },
});

const regularUserLimiter = createRateLimiter(parseInt(process.env.RATE_LIMIT_REGULAR_USER || '50', 10));
const adminLimiter = createRateLimiter(parseInt(process.env.RATE_LIMIT_ADMIN || '500', 10));

export const rateLimiter = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const username = req.decodedToken?.username;

        if (!username) {
            return regularUserLimiter(req, res, next);
        }

        const user = await User.findOne({ where: { username } });

        if (user && user.role === UserRole.ADMIN) {
            return adminLimiter(req, res, next);
        }

        return regularUserLimiter(req, res, next);

    } catch (error) {
        console.error('Error in rateLimiter middleware:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
