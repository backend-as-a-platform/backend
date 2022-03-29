import { Request, Response, Router } from 'express';
import router from '.';
import { setError } from '../../lib/error';

/** Sends 404 for invalid route requests
 *  Works with every HTTP methods
 **/
export default (path: string, apiRouter: Router): void => {
  const route = router(path, apiRouter);

  route.use((_: Request, res: Response) => {
    const err = setError(404);

    res.status(404).send(err);
  });
};
