import { Router } from 'express';
import user from './routes/user';
import project from './routes/project';
import fourOhFour from './routes/404';

/** Returns API router */
export default (): Router => {
  const router = Router({ caseSensitive: true });

  /** Top-level route definitions
   *  Express Router needs to be injected as dependency
   */
  user('/users', router);
  project('/projects', router);
  fourOhFour('/', router);

  return router;
};
