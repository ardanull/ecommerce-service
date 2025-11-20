import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessSecret = process.env.JWT_ACCESS_SECRET || 'access_secret';

export interface JwtPayload {
  sub: string;
  role: string;
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, accessSecret) as JwtPayload;
}
