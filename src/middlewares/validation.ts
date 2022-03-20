import { Request, Response, NextFunction } from 'express';
import schema from '../models/user/validation';

/** Sets whether current operation is creation or updation.
 *  It's needed for validation.
 **/
const prevalidate = (
  { body, method }: Request,
  _: Response,
  next: NextFunction
): void => {
  body.creationMode = method === 'POST' ? true : false;
  next();
};

const validateUser = async (
  { body }: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await schema.validateAsync(body, { allowUnknown: true });
    next();
  } catch (err) {
    next({ status: 400, reason: err.message });
  }
};

export { prevalidate, validateUser };
