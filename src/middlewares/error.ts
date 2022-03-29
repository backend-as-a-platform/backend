import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { setError } from '../lib/error';

/** Returns API error middleware
 *  that sends response with status code and reason if any.
 **/
export default () =>
  (
    { status, reason }: Record<string, any>,
    _: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const response = setError(status, reason);

    res.status(status).send(response);
    next();
  };

/** Passes upload errors to API error handler */
export const uploadError = (
  err: MulterError,
  _: Request,
  _r: Response,
  next: NextFunction
): void => next({ status: 400, reason: err.reason || err.message });
