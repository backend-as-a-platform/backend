import { Request, Response, NextFunction } from 'express';
import userSchema, { emailSchema } from '../models/user/validation';
import projectSchema from '../models/project/validation';
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

const validateUserEmail = async (
  { params }: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  const body = { email: params.mailId };

  try {
    await emailSchema.validateAsync(body, { allowUnknown: true });
    next();
  } catch (err) {
    next({ status: 400, reason: err.message });
  }
};

const validateProject = async (
  { body }: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await projectSchema.validateAsync(body, { allowUnknown: true });
    next();
  } catch (err) {
    next({ status: 400, reason: err.message });
  }
};

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

export {
  prevalidate,
  validateUser,
  validateUserEmail,
  validateProject,
  validateForm,
};
