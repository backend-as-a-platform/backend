import { Request, Response, NextFunction } from 'express';
import userSchema from '../models/user/validation';
import formSchema from '../models/form/validation';

/** Sets whether the current operation is creation or updation.
 *  It's required for validating Joi schema.
 **/
const prevalidate = (
  { body, method }: Request,
  _: Response,
  next: NextFunction
): void => {
  body.creationMode = method === 'POST';
  next();
};

const validateUser = async (
  { body }: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await userSchema.validateAsync(body, { allowUnknown: true });
    next();
  } catch (err) {
    next({ status: 400, reason: err.message });
  }
};

// Can be used to validate Project also as
// both require only 'name' field to be checked
const validateForm = async (
  { body }: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await formSchema.validateAsync(body, { allowUnknown: true });
    next();
  } catch (err) {
    next({ status: 400, reason: err.message });
  }
};

export { prevalidate, validateUser, validateForm };
