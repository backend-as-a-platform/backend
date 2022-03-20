import { Request, Response, NextFunction } from 'express';
import { verify, JwtPayload } from 'jsonwebtoken';
import config from '../app/config';
import User from '../models/user';

const jwtSecret = config('JWT_SECRET');

/**
 * Returns middleware that requires
 * user to authenticate to access a route.
 **/
export default async (
  req: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authToken = req.headers.authorization.split('Bearer ')[1];
    const { _id } = verify(authToken, jwtSecret) as JwtPayload;

    const currentUser = await User.findOne({
      _id,
      'authTokens.authToken': authToken,
    });

    if (!currentUser) {
      throw new Error();
    }

    req.currentUser = currentUser;
    req.authToken = authToken;

    next();
  } catch (err) {
    next({ status: 400, reason: 'authentication failed' });
  }
};
