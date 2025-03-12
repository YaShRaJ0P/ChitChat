import jwt from 'jsonwebtoken';
import { config } from '../utils';

export const generateAccessToken = ({ id, email }: { id: string, email: string }) => {
    return jwt.sign({ id, email }, config.ACCESS_JWT_SECRET, { expiresIn: '15m' });
}


export const generateRefreshToken = ({ id, email }: { id: string, email: string }) => {
    return jwt.sign({ id, email }, config.REFRESH_JWT_SECRET, { expiresIn: '7d' });
}

export const verifyToken = (token: string, secret: string): { id: string; email: string } | null => {
    try {
        return jwt.verify(token, secret) as { id: string; email: string };
    } catch (error) {
        return null; // Token is invalid
    }
};
