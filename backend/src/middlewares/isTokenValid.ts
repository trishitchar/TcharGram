import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
  userId: string;
}

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const isTokenValid = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = await req.cookies.token;
    // console.log("istokenvaild token:",token)

    if (!token) {
      res.status(401).json({
        message: 'User not authenticated',
        success: false
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;

    if (!decoded || !decoded.userId) {
      res.status(401).json({
        message: 'Invalid token',
        success: false
      });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

export default isTokenValid;